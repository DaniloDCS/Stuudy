import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

export const connection = createClient(process.env.URL, process.env.KEY);