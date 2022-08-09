const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")

const Story = require("../models/Story")

// Get Show add page /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add")
})

// @des Process add form
// @route Post /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Story.create(req.body)
    res.redirect("/dashboard")
  } catch (err) {
    console.error(err)
    res.render("error/500")
  }
})
module.exports = router
