import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const connectSupabase = async () => {
    try {
        const { error } = await supabase.from('users').select('id').limit(1);
        if (error) throw error;
        console.log('supabase connected ');
    } catch (err) {
        console.error('supabase connection error ');
        throw err;
    }
}