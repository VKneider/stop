export default function gameMiddleware(req, res, next) {
  if (req.session.room==req.body.room) {
    next();
  } else {
    res.redirect('/');
  }
}