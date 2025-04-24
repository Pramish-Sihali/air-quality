// app/api/fetch-air-quality/route.ts
import {  NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = promisify(exec);

export async function POST() {
  try {
    // Execute the Python controller script
    const { stdout, stderr } = await execPromise('python3 run_air_quality_apis.py');
    
    if (stderr) {
      console.error('Error from Python script:', stderr);
      return NextResponse.json(
        { error: 'Error fetching air quality data' },
        { status: 500 }
      );
    }
    
    // Try to read the metadata file to get the results
    const metadataPath = path.join(process.cwd(), 'data', 'api_data', 'metadata.json');
    let metadata = null;
    
    if (fs.existsSync(metadataPath)) {
      const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
      metadata = JSON.parse(metadataContent);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Data fetched successfully',
      output: stdout,
      metadata
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch air quality data' },
      { status: 500 }
    );
  }
}