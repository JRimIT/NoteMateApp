import express from 'express';
import path from 'path';
import multer from 'multer';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import FormData from 'form-data';
// Import Google Gemini SDK
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { path: filePath, mimetype, originalname } = req.file;
        console.log('Received file at:', filePath);

        const formData = new FormData();
        formData.append('apikey', process.env.OCR_SPACE_API_KEY);
        formData.append('language', 'auto '); // Tiếng Việt
        formData.append('isOverlayRequired', 'false');
        formData.append('OCREngine', '2');
        formData.append('file', fs.createReadStream(filePath), {
            contentType: mimetype,
            filename: originalname
        });

        const response = await axios.post('https://api.ocr.space/parse/image', formData, {
            headers: formData.getHeaders(),
        });

        const { ParsedResults } = response.data;

        console.log('OCR API response:', response.data);

        if (!ParsedResults || ParsedResults.length === 0 || !ParsedResults[0].ParsedText) {
            throw new Error('No text found in the image.');
        }

        const extractedText = ParsedResults[0].ParsedText.trim();
        console.log('Extracted text:', extractedText);

        const aiSummary = await summarizeWithGemini(extractedText);

        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        res.json({ text: extractedText, summary: aiSummary });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process image.' });
    }
});

async function summarizeWithGemini(text) {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    { parts: [{ text: `Hãy tổng hợp đoạn văn sau bằng tiếng Việt:\n\n${text}` }] }
                ]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const summary = response.data.candidates[0].content.parts[0].text;
        return summary;
    } catch (error) {
        console.error('Error calling Gemini API:', error.response?.data || error.message);
        return 'Tổng hợp thất bại';
    }
}

// async function summarizeText(inputText) {
//     try {
//         const response = await axios.post(
//             'https://api.openai.com/v1/chat/completions',
//             {
//                 model: 'gpt-4o',
//                 messages: [
//                     { role: 'system', content: 'Bạn là AI tổng hợp nội dung từ ảnh OCR.' },
//                     { role: 'user', content: `Hãy tổng hợp đoạn văn sau:\n\n${inputText}` },
//                 ],
//                 temperature: 0.7,
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//                 },
//             }
//         );

//         return response.data.choices[0].message.content;
//     } catch (error) {
//         console.error('Error calling GPT API:', error.response?.data || error.message);
//         return 'Tổng hợp thất bại';
//     }
// }

export default router;
