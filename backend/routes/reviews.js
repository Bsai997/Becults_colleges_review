import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

// GET /api/reviews/:collegeId - Get reviews for a college with filters and pagination
router.get('/reviews/:collegeId', async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { branch, year, type, page = 1 } = req.query;
    console.log('GET /reviews/:collegeId - collegeId:', collegeId, 'page:', page);
    
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

    if (error) {
      console.error('Supabase error fetching reviews:', error);
      throw error;
    }

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
    console.log('POST /reviews - Received body:', req.body);
    
    const {
      college_id,
      name,
      college_id_number,
      branch,
      year,
      batch,
      admission_type,
      eapcet_rank,
      instagram_id,
      is_hosteller,
      college_hostel_available,
      outside_hostel,
      faculty,
      placements,
      tech_events,
      infrastructure,
      college_life,
      accommodation,
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
      'admission_type',
      'faculty',
      'placements',
      'tech_events',
      'infrastructure',
      'college_life',
      'accommodation',
      'pros',
      'cons',
      'advice_to_juniors',
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

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    console.log('Attempting to insert review with:', {
      college_id,
      pros_count: pros?.length,
      cons_count: cons?.length
    });

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
          admission_type,
          eapcet_rank: eapcet_rank ? parseInt(eapcet_rank) : null,
          instagram_id,
          is_hosteller,
          college_hostel_available,
          outside_hostel,
          faculty,
          placements,
          tech_events,
          infrastructure,
          college_life,
          accommodation,
          pros: pros.filter(p => p.trim()),
          cons: cons.filter(c => c.trim()),
          advice_to_juniors,
          overall_about_college
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log('Review created successfully:', data?.id);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating review:', error.message, error.details || '');
    res.status(500).json({ 
      error: error.message,
      details: error.details || error.hint || 'Unknown error'
    });
  }
});

export default router;
