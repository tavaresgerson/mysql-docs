### 17.11.3 Pontos de verificação do InnoDB

Tornar seus arquivos de registro muito grandes pode reduzir o I/O do disco durante o checkpointing. Muitas vezes faz sentido definir o tamanho total dos arquivos de registro tão grande quanto o pool de buffers ou até maior.

#### Como funciona o processamento de ponto de controle

`InnoDB` implementa um mecanismo de verificação de ponto conhecido como verificação fuzzy. `InnoDB` esvazia as páginas de banco de dados modificadas do pool de buffer em pequenos lotes. Não é necessário esvaziar o pool de buffer em um único lote, o que interromperia o processamento das instruções SQL do usuário durante o processo de verificação de ponto.

Durante a recuperação de falhas, o `InnoDB` procura por uma etiqueta de ponto de verificação escrita nos arquivos de log. Ele sabe que todas as modificações no banco de dados antes da etiqueta estão presentes na imagem do disco do banco de dados. Em seguida, o `InnoDB` examina os arquivos de log a partir do ponto de verificação, aplicando as modificações registradas no banco de dados.
