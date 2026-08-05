import redis from "../../shared/redis/redis.js"

export const getCurrentUser = async (req, res) => {
  try {
    const response = await fetch(`${process.env.AUTH_SERVICE}/me?userId=${req.user.userId}`)
    const user = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(user)
    }

    const sessionId = req.cookies?.session
    if (sessionId) {
      await redis.set(`session-${sessionId}`, JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt
      }), "EX", 7 * 24 * 60 * 60)
    }

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: `get current user error ${error}` });
  }
};
