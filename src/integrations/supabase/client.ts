import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://masgtcyfxfwhriajrlik.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hc2d0Y3lmeGZ3aHJpYWpybGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMTYxMzMsImV4cCI6MjA2Mjc5MjEzM30.V5DBEczIGnWykI9seB82yLOu-DYDEjgtO2Xpfx0t88c";


export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);