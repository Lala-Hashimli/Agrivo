export async function healthCheck(req, res) {
  res.json({
    status: "ok",
    message: "Agrivo backend is running",
  });
}
