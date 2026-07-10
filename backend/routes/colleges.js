import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

// GET /api/colleges/top10 - Get top 10 colleges
router.get('/colleges/top10', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('colleges')
      .select('id, instcode, name, location, affiliation, created_at')
      .limit(10);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching top 10 colleges:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/colleges/search?q= - Search colleges by name
router.get('/colleges/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const { data, error } = await supabase
      .from('colleges')
      .select('id, instcode, name, location, affiliation, created_at')
      .ilike('name', `%${q}%`)
      .limit(5);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error searching colleges:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/colleges/:collegeId/stats - Get college statistics (must be before :collegeId route)
router.get('/colleges/:collegeId/stats', async (req, res) => {
  try {
    const { collegeId } = req.params;
    console.log('Fetching stats for collegeId:', collegeId);

    const { data, error } = await supabase
      .from('reviews')
      .select('faculty_rating, placements_rating, infrastructure_rating, is_hosteller, hostel_rating')
      .eq('college_id', collegeId);

    if (error) {
      console.error('Error querying reviews:', error);
      throw error;
    }

    if (data.length === 0) {
      return res.json({
        average_overall_rating: 0,
        average_faculty_rating: 0,
        average_placements_rating: 0,
        average_infrastructure_rating: 0,
        average_hostel_rating: 0,
        total_reviews: 0
      });
    }

    // Calculate averages
    let facultySum = 0, placementsSum = 0, infrastructureSum = 0;
    let hostelSum = 0, hostelCount = 0;

    data.forEach(review => {
      facultySum += review.faculty_rating;
      placementsSum += review.placements_rating;
      infrastructureSum += review.infrastructure_rating;

      if (review.is_hosteller && review.hostel_rating) {
        hostelSum += review.hostel_rating;
        hostelCount += 1;
      }
    });

    const avgFaculty = facultySum / data.length;
    const avgPlacements = placementsSum / data.length;
    const avgInfrastructure = infrastructureSum / data.length;
    const avgHostel = hostelCount > 0 ? hostelSum / hostelCount : 0;

    // Calculate overall rating by averaging faculty, placements, infrastructure
    let overallSum = avgFaculty + avgPlacements + avgInfrastructure;
    let ratingCount = 3;
    
    // Include hostel in overall rating if there are hostel ratings
    if (hostelCount > 0) {
      overallSum += avgHostel;
      ratingCount = 4;
    }

    const stats = {
      average_overall_rating: parseFloat((overallSum / ratingCount).toFixed(1)),
      average_faculty_rating: parseFloat(avgFaculty.toFixed(1)),
      average_placements_rating: parseFloat(avgPlacements.toFixed(1)),
      average_infrastructure_rating: parseFloat(avgInfrastructure.toFixed(1)),
      average_hostel_rating: hostelCount > 0 ? parseFloat(avgHostel.toFixed(1)) : 0,
      total_reviews: data.length
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching college stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/colleges/:collegeId - Get single college details
router.get('/colleges/:collegeId', async (req, res) => {
  try {
    const { collegeId } = req.params;

    const { data, error } = await supabase
      .from('colleges')
      .select('id, instcode, name, location, affiliation, created_at')
      .eq('id', collegeId)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
