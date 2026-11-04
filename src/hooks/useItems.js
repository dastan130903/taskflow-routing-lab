import { useEffect, useState } from 'react';
import { getItemsList } from '../services/service.js';
export default function useItems() {
 const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[version,setVersion]=useState(0);
 useEffect(()=>{let ignore=false;setLoading(true);setError('');getItemsList().then(res=>{if(!ignore)setItems(res.data);}).catch(err=>{if(!ignore)setError(err.message);}).finally(()=>{if(!ignore)setLoading(false);});return()=>{ignore=true;};},[version]);
 return {items,loading,error,reload:()=>setVersion(v=>v+1)};
}
