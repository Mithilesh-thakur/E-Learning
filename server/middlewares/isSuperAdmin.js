const isSuperAdmin = (req, res, next) => {
  console.log('🔍 SuperAdmin Check:', {
    userRole: req.role,
    userId: req.id,
    url: req.url
  });
  
  if (req.role !== "superAdmin") {
    console.log('❌ Access denied: User role is not superAdmin');
    return res.status(403).json({
      success: false,
      message: "Access denied. SuperAdmin only."
    });
  }
  
  console.log('✅ SuperAdmin access granted');
  next();
};

// Middleware to check if superAdmin is accessing their own data
const isOwnSuperAdmin = (req, res, next) => {
  console.log('🔍 Own SuperAdmin Check:', {
    userRole: req.role,
    userId: req.id,
    requestedId: req.params.id || req.body.superAdminId,
    url: req.url
  });
  
  if (req.role !== "superAdmin") {
    console.log('❌ Access denied: User role is not superAdmin');
    return res.status(403).json({
      success: false,
      message: "Access denied. SuperAdmin only."
    });
  }

  // Check if superAdmin is accessing their own data
  const requestedId = req.params.id || req.body.superAdminId;
  if (requestedId && requestedId !== req.id) {
    console.log('❌ Access denied: User trying to access another superAdmin data');
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own data."
    });
  }

  console.log('✅ Own SuperAdmin access granted');
  next();
};

export default isSuperAdmin;
export { isOwnSuperAdmin }; 