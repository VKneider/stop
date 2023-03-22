export default function gameMiddleware(req, res, next) {
  
  console.log(req.session)
  if (req.session.room) {
    res.redirect("http://localhost:3003/game?room="+req.session.room);
  } else {
    next();
  }

}