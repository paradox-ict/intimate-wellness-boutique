create policy "Admins read payment proofs" on storage.objects for select to authenticated
  using (bucket_id = 'payment-proofs' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete payment proofs" on storage.objects for delete to authenticated
  using (bucket_id = 'payment-proofs' and public.has_role(auth.uid(), 'admin'));