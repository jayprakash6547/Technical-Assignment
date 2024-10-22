// src/models/candidateModel.ts
import mongoose from 'mongoose';

// Define the Candidate Schema
const candidateSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    experience: String,
    skills: String,
    otherDetails: String
});

// Create the Candidate model
const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
