import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';
import Conflict from '../models/conflict.model.js';

// Initialize environment variables
dotenv.config();

// Resolve paths for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Converts string or null values safely to numbers, scrubbing out comma formatting.
 * @param {any} val - The input value
 * @param {number|null} [defaultValue=null] - Fallback value
 * @returns {number|null}
 */
const toNumber = (val, defaultValue = null) => {
  if (val === undefined || val === null || val === '' || val === 'null') {
    return defaultValue;
  }
  const cleanedVal = String(val).replace(/,/g, '').trim();
  const num = Number(cleanedVal);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Converts Yes/No/True/False strings to booleans.
 * @param {any} val - The input value
 * @returns {boolean}
 */
const toBoolean = (val) => {
  if (val === undefined || val === null) return false;
  const str = String(val).trim().toLowerCase();
  return str === 'yes' || str === 'true';
};

/**
 * Maps raw snake_case/percentage header records to cleaner camelCase structures.
 * @param {object[]} data - Raw array from JSON file
 * @returns {object[]} Transformed array for Mongoose seed insertion
 */
const transformData = (data) => {
  return data.map((record) => {
    return {
      conflictName: record.Conflict_Name ? String(record.Conflict_Name).trim() : '',
      conflictType: record.Conflict_Type ? String(record.Conflict_Type).trim() : '',
      region: record.Region ? String(record.Region).trim() : '',
      startYear: toNumber(record.Start_Year, 0),
      endYear: toNumber(record.End_Year, 0),
      status: record.Status ? String(record.Status).trim() : '',
      primaryCountry: record.Primary_Country ? String(record.Primary_Country).trim() : '',
      
      preWarUnemployment: toNumber(record['Pre_War_Unemployment_%']),
      duringWarUnemployment: toNumber(record['During_War_Unemployment_%']),
      unemploymentSpike: toNumber(record.Unemployment_Spike_Percentage_Points),
      mostAffectedSector: record.Most_Affected_Sector ? String(record.Most_Affected_Sector).trim() : null,
      youthUnemploymentChange: toNumber(record['Youth_Unemployment_Change_%']),
      
      preWarPovertyRate: toNumber(record['Pre_War_Poverty_Rate_%']),
      duringWarPovertyRate: toNumber(record['During_War_Poverty_Rate_%']),
      extremePovertyRate: toNumber(record['Extreme_Poverty_Rate_%']),
      foodInsecurityRate: toNumber(record['Food_Insecurity_Rate_%']),
      householdsFallenIntoPoverty: toNumber(record.Households_Fallen_Into_Poverty_Estimate),
      
      gdpChange: toNumber(record['GDP_Change_%'], 0), 
      inflationRate: toNumber(record['Inflation_Rate_%'], 0),
      currencyDevaluation: toNumber(record['Currency_Devaluation_%']),
      warCostUsd: toNumber(record.Cost_of_War_USD, 0),
      reconstructionCostUsd: toNumber(record.Estimated_Reconstruction_Cost_USD, 0),
      
      informalEconomyPreWar: toNumber(record['Informal_Economy_Size_Pre_War_%']),
      informalEconomyDuringWar: toNumber(record['Informal_Economy_Size_During_War_%']),
      blackMarketActivityLevel: record.Black_Market_Activity_Level ? String(record.Black_Market_Activity_Level).trim() : null,
      primaryBlackMarketGoods: record.Primary_Black_Market_Goods ? String(record.Primary_Black_Market_Goods).trim() : null,
      currencyBlackMarketGap: toNumber(record['Currency_Black_Market_Rate_Gap_%']),
      warProfiteeringDocumented: toBoolean(record.War_Profiteering_Documented)
    };
  });
};

const seedData = async () => {
  try {
    console.log('[Seeder] Connecting to database...');
    await connectDB();

    console.log('[Seeder] Wiping old conflict documents...');
    await Conflict.deleteMany({});
    console.log('[Seeder] Existing conflicts cleared.');

    // Load JSON file contents asynchronously
    const rawPath = path.join(__dirname, '../data/war_economic_impact_dataset.json');
    console.log(`[Seeder] Loading raw dataset from: ${rawPath}`);
    const rawData = fs.readFileSync(rawPath, 'utf-8');
    const parsedData = JSON.parse(rawData);

    console.log('[Seeder] Transforming records...');
    const transformed = transformData(parsedData);

    console.log('[Seeder] Inserting records into MongoDB...');
    const result = await Conflict.insertMany(transformed);
    console.log(`[Seeder] Successfully imported ${result.length} conflict records.`);

    // Terminate DB connection gracefully
    await mongoose.connection.close();
    console.log('[Seeder] Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Seeding process failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
