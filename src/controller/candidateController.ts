// src/controllers/candidateController.ts
import { Request, Response } from "express";
import async from "async";
import XLSX from "xlsx";
import Candidate from "../models/candiateModel";

// Function to upload and process Excel file
export const uploadExcel = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Read the Excel file
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Process each candidate row using async.eachSeries
    async.eachSeries(
      sheet,
      async (candidateData: any, callback: any) => {
        try {
          // Check for duplicates (by email)
          const existingCandidate = await Candidate.findOne({
            email: candidateData.email,
          });
          if (existingCandidate) {
            console.log(`Duplicate found: ${candidateData.email}`);
            return callback(); // Skip this record
          }

          // Create a new candidate
          const newCandidate = new Candidate({
            name: candidateData.name,
            email: candidateData.email,
            phone: candidateData.phone,
            experience: candidateData.experience,
            skills: candidateData.skills,
            otherDetails: candidateData.otherDetails,
          });

          // Save the candidate in MongoDB
          await newCandidate.save();
          callback(); // Proceed to the next candidate
        } catch (error) {
          callback(error); // Handle the error and move to the next row
        }
      },
      (err: any) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error processing file", error: err });
        }
        return res.status(200).json({ message: "File processed successfully" });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Error reading file", error });
  }
};
