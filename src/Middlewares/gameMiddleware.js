export default function gameMiddleware(req, res, next) {
  
  if (req.session.room) {
    res.redirect("http://localhost:3003/game?room="+req.session.room);
  } else {
    next();
  }

}