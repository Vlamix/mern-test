const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const router = Router()
const config = require('config')

router.post(
   '/register',
   [
      check('email', 'Not correct email').isEmail(),
      check('password', 'min length of password 6'),
   ],
   async (req, res) => {
      try {
         console.log(req.body)
         const errors = validationResult(req)
         if (!errors.isEmpty()) {
            return res
               .status(400)
               .json({ errors: errors.array(), message: 'incorrect data' })
         }
         const { email, password } = req.body
         const candidate = await User.findOne({ email })

         if (candidate) {
            res.status(400).json({ message: 'This user already created' })
         }

         const hashedPassword = await bcrypt.hash(password, 12)
         const user = new User({ email, password: hashedPassword })

         await user.save()

         res.status(201).json({ message: 'User done' })
      } catch (e) {
         res.status(500).json({ message: 'Smthing isnt working' })
      }
   }
)

router.post(
   '/login',
   [
      check('email', 'Write email').normalizeEmail().isEmail(),
      check('password', 'Write password').exists(),
   ],
   async (req, res) => {
      try {
         const errors = validationResult(req)
         if (!errors.isEmpty()) {
            return res
               .status(400)
               .json({ errors: errors.array(), message: 'incorrect data' })
         }
         const { email, password } = req.body
         const user = await User.findOne({ email })

         if (!user) {
            return res.status(400).json({ message: 'User not found' })
         }

         const isMatch = await bcrypt.compare(password, user.password)

         if (!isMatch) {
            return res.status(400).json({ message: 'Isnt correct password' })
         }
         const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
            expiresIn: '1h',
         })
         return res.status(200).json({ token, userId: user.id })
      } catch (e) {
         res.status(500).json({ message: 'Smthing isnt working' })
      }
   }
)

router.get('/users', async (req, res) => {
   try {
      const users = await User.find()
      return res.status(200).json({ users: users })
   } catch (e) {
      res.status(500).json({ message: 'Smthing isnt working' })
   }
})

module.exports = router
