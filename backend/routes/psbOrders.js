const express = require('express');
const router = express.Router();
const PSBOrder = require('../models/PSBOrder');
const { auth } = require('../middleware/auth');

// Get all PSB orders with pagination and filters
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.cluster) filter.cluster = { $regex: req.query.cluster, $options: 'i' };
    if (req.query.sto) filter.sto = { $regex: req.query.sto, $options: 'i' };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { customerName: { $regex: req.query.search, $options: 'i' } },
        { orderNo: { $regex: req.query.search, $options: 'i' } },
        { customerPhone: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const orders = await PSBOrder.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PSBOrder.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching PSB orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch PSB orders'
    });
  }
});

// Get PSB order analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const totalOrders = await PSBOrder.countDocuments();
    const completedOrders = await PSBOrder.countDocuments({ status: 'Completed' });
    const pendingOrders = await PSBOrder.countDocuments({ status: 'Pending' });
    const inProgressOrders = await PSBOrder.countDocuments({ status: 'In Progress' });

    // Get orders by cluster
    const clusterStats = await PSBOrder.aggregate([
      {
        $group: {
          _id: '$cluster',
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get orders by STO
    const stoStats = await PSBOrder.aggregate([
      {
        $group: {
          _id: '$sto',
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get monthly trends
    const monthlyTrends = await PSBOrder.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalOrders,
          completedOrders,
          pendingOrders,
          inProgressOrders,
          completionRate: totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0
        },
        clusterStats,
        stoStats,
        monthlyTrends
      }
    });
  } catch (error) {
    console.error('Error fetching PSB analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch PSB analytics'
    });
  }
});

// Create new PSB order
router.post('/', auth, async (req, res) => {
  try {
    // Get the next order number
    const lastOrder = await PSBOrder.findOne().sort({ no: -1 });
    const nextNo = lastOrder ? lastOrder.no + 1 : 1;

    const orderData = {
      ...req.body,
      no: nextNo,
      createdBy: req.user._id
    };

    const order = new PSBOrder(orderData);
    await order.save();

    await order.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: order,
      message: 'PSB order created successfully'
    });
  } catch (error) {
    console.error('Error creating PSB order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create PSB order'
    });
  }
});

// Update PSB order
router.put('/:id', auth, async (req, res) => {
  try {
    const order = await PSBOrder.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    ).populate('createdBy updatedBy', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'PSB order not found'
      });
    }

    res.json({
      success: true,
      data: order,
      message: 'PSB order updated successfully'
    });
  } catch (error) {
    console.error('Error updating PSB order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update PSB order'
    });
  }
});

// Delete PSB order
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await PSBOrder.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'PSB order not found'
      });
    }

    res.json({
      success: true,
      message: 'PSB order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting PSB order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete PSB order'
    });
  }
});

module.exports = router;