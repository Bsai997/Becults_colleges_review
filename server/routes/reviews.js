import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

// GET /api/reviews/:collegeId - Get reviews for a college with filters and pagination
router.get('/reviews/:collegeId', async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { branch, year, type, page = 1 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limit = 10;
    const offset = (pageNum - 1) * limit;

    let query = supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('college_id', collegeId);

    // Apply filters
    if (branch) {
      query = query.eq('branch', branch);
    }

    if (year) {
      query = query.eq('year', parseInt(year));
    }

    if (type === 'hosteller') {
      query = query.eq('is_hosteller', true);
    } else if (type === 'dayscholar') {
      query = query.eq('is_hosteller', false);
    }

    // Order by created_at descending and apply pagination
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / limit);

    const responseData = {
      reviews: data,
      total_count: count,
      page: pageNum,
      total_pages: totalPages
    };

    // Add cache headers
    res.set('Cache-Control', 'public, max-age=60');
    res.set('ETag', `"reviews-${collegeId}-${pageNum}"`);
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews - Create a new review
router.post('/reviews', async (req, res) => {
  try {
    const {
      college_id,
      name,
      college_id_number,
      branch,
      year,
      batch,
      is_hosteller,
      college_hostel_available,
      outside_hostel,
      faculty_rating,
      faculty_reason,
      placements_rating,
      placements_reason,
      infrastructure_rating,
      infrastructure_reason,
      hostel_rating,
      hostel_reason,
      pros,
      cons,
      advice_to_juniors,
      overall_about_college
    } = req.body;

    // Validation
    const requiredFields = [
      'college_id',
      'name',
      'college_id_number',
      'branch',
      'year',
      'batch',
      'faculty_rating',
      'placements_rating',
      'infrastructure_rating',
      'pros',
      'cons',
      'overall_about_college'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = req.body[field];
      if (Array.isArray(value)) {
        return value.length === 0 || (value.length === 1 && !value[0].trim());
      }
      return value === undefined || value === null || value === '';
    });

    // Check is_hosteller separately (can be false or true)
    if (req.body.is_hosteller === undefined || req.body.is_hosteller === null) {
      missingFields.push('is_hosteller');
    }

    if (req.body.is_hosteller && !req.body.hostel_rating) {
      missingFields.push('hostel_rating');
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Calculate overall_rating
    let ratingSum = faculty_rating + placements_rating + infrastructure_rating;
    let ratingCount = 3;

    if (is_hosteller && hostel_rating) {
      ratingSum += hostel_rating;
      ratingCount = 4;
    }

    const overallRating = parseFloat((ratingSum / ratingCount).toFixed(1));

    // Insert review
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          college_id,
          name,
          college_id_number,
          branch,
          year: parseInt(year),
          batch,
          is_hosteller,
          college_hostel_available: is_hosteller ? college_hostel_available : null,
          outside_hostel: is_hosteller ? outside_hostel : null,
          faculty_rating: parseInt(faculty_rating),
          faculty_reason,
          placements_rating: parseInt(placements_rating),
          placements_reason,
          infrastructure_rating: parseInt(infrastructure_rating),
          infrastructure_reason,
          hostel_rating: is_hosteller ? parseInt(hostel_rating) : null,
          hostel_reason: is_hosteller ? hostel_reason : null,
          pros: pros.filter(p => p.trim()),
          cons: cons.filter(c => c.trim()),
          advice_to_juniors,
          overall_about_college,
          overall_rating: overallRating
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
