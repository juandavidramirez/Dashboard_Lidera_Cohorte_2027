import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://muyqxxzjcgwyvluzumbt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  let all = [];
  let start = 0;
  const limit = 1000;
  while(true) {
    const { data, error } = await supabase.from('candidates_convocatoria').select('id').range(start, start + limit - 1);
    if(error) { console.error(error); break; }
    all.push(...data);
    if(data.length < limit) break;
    start += limit;
  }
  console.log("Total Fetched:", all.length);
}
test();
