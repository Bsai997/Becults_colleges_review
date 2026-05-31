import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

// GET /api/colleges/top10 - Get top 10 colleges by average rating with optimized query
router.get('/colleges/top10', async (req, res) => {
  try {
    // Use database aggregation instead of fetching all data
    const { data: collegesWithStats, error } = await supabase
      .from('colleges')
      .select(`
        id,
        name,
        location,
        affiliation,
        reviews (overall_rating)
      `);

    if (error) throw error;

    // Map and calculate stats
    const collegesWithScores = collegesWithStats.map(college => {
      const reviews = college.reviews || [];
      const totalRating = reviews.reduce((sum, review) => sum + review.overall_rating, 0);
      const count = reviews.length;
      
      return {
        id: college.id,
        name: college.name,
        location: college.location,
        affiliation: college.affiliation,
        average_rating: count > 0 ? parseFloat((totalRating / count).toFixed(1)) : 0,
        total_reviews: count
      };
    });

    // Sort and get top 10
    const top10 = collegesWithScores
      .sort((a, b) => {
        if (b.average_rating !== a.average_rating) {
          return b.average_rating - a.average_rating;
        }
        return a.name.localeCompare(b.name);
      })
      .slice(0, 10);

    res.set('ETag', `"top10-${Date.now()}"`);
    res.json(top10);
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
      .select('id, name, location')
      .ilike('name', `%${q}%`)
      .limit(5);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error searching colleges:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/colleges/:collegeId - Get single college details
router.get('/colleges/:collegeId', async (req, res) => {
  try {
    const { collegeId } = req.params;

    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', collegeId)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/colleges/:collegeId/stats - Get college statistics
router.get('/colleges/:collegeId/stats', async (req, res) => {
  try {
    const { collegeId } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('college_id', collegeId);

    if (error) throw error;

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

export default router;
