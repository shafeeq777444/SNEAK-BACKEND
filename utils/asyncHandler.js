const asyncHandler = (fn) => {
    return (req, res, next) => { //this is created by middleware middleware parameter have err,req,res,next
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = asyncHandler;
