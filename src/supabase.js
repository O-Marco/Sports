// src/supabase.js
// Este arquivo é a "ponte" entre o React e o banco de dados

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dsliwksagiehfigcscpf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbGl3a3NhZ2llaGZpZ2NzY3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NDkzMjAsImV4cCI6MjA5MDIyNTMyMH0.z36mrxfSPiJvpuDsFM7WfzxWAJsD9TdjcXHywToZFnA'

export const supabase = createClient(supabaseUrl, supabaseKey)