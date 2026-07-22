import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

// GET /api/colleges/top10 - Get top 10 colleges
router.get('/colleges/top10', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('colleges')
      .select('id, instcode, name, location, affiliation') // Dropped created_at to shrink payload
      .order('sno', { ascending: true })                  // Forces high-speed index usage
      .limit(94);

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
// router.get('/colleges/:collegeId/stats', async (req, res) => {
//   try {
//     const { collegeId } = req.params;
//     console.log('Fetching stats for collegeId:', collegeId);

//     const { data, error } = await supabase
//       .from('reviews')
//       .select('id')
//       .eq('college_id', collegeId);

//     if (error) {
//       console.error('Error querying reviews:', error);
//       throw error;
//     }

//     if (data.length === 0) {
//       return res.json({
//         average_overall_rating: 0,
//         average_faculty_rating: 0,
//         average_placements_rating: 0,
//         average_infrastructure_rating: 0,
//         average_hostel_rating: 0,
//         total_reviews: 0
//       });
//     }

//     // The current review form collects written feedback rather than numeric ratings.
//     const stats = {
//       average_overall_rating: 0,
//       average_faculty_rating: 0,
//       average_placements_rating: 0,
//       average_infrastructure_rating: 0,
//       average_hostel_rating: 0,
//       total_reviews: data.length
//     };

//     res.json(stats);
//   } catch (error) {
//     console.error('Error fetching college stats:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

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
