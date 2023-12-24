 const bcrypt = require('bcrypt');
const express = require('express');
const { STATUS_CODES } = require('http-status-codes');
const dbConnection = require('../db/dbConfig');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!email || !password || !firstname || !lastname || !username) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ msg: 'Please provide all required fields!' });
  }
  try {
    const [user] = await dbConnection.query(
      'SELECT username, userid FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (user.length > 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ msg: 'User already exists' });
    }
    if (password.length <= 8) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: 'Password must be at least 8 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      'INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)',
      [username, firstname, lastname, email, hashedPassword]
    );

    return res.status(STATUS_CODES.CREATED).json({ msg: 'User registered' });
  } catch (error) {
    console.log(error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong, try again later!' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ msg: 'Please provide email and password' });
  }
  try {
    const [user] = await dbConnection.query(
      'SELECT username, password FROM users WHERE email = ?',
      [email]
    );
    
    if (user.length === 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ msg: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ msg: 'Invalid credentials' });
    }

    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username: username, userid: userid }, 'secret', { expiresIn: '1d' });

    return res.status(STATUS_CODES.OK).json({ msg: 'User login successful', token });
  } catch (error) {
    console.log(error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong, try again later!' });
  }
}

async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  res.status(STATUS_CODES.OK).json({ msg: "Valid user", userid });
  // The above line sends a JSON response with the message "valid user" and the userid

  // If you also want to send a plain text response, you can use:
  // res.send('Check user');
}

module.exports = { register, login, checkUser };