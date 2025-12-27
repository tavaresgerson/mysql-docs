### 17.11.3 Pontos de Controle do InnoDB

Tornar seus arquivos de log muito grandes pode reduzir o I/O de disco durante o ponto de controle. Muitas vezes, faz sentido definir o tamanho total dos arquivos de log tão grande quanto o pool de buffers ou até maior.

#### Como o Processamento do Ponto de Controle Funciona

O `InnoDB` implementa um mecanismo de ponto de controle conhecido como ponto de controle difuso. O `InnoDB` esvazia as páginas do banco de dados modificadas do pool de buffers em pequenos lotes. Não há necessidade de esvaziar o pool de buffers em um único lote, o que interromperia o processamento das instruções SQL do usuário durante o processo de ponto de controle.

Durante a recuperação após falha, o `InnoDB` procura uma etiqueta de ponto de controle escrita nos arquivos de log. Ele sabe que todas as modificações no banco de dados antes da etiqueta estão presentes na imagem do disco do banco de dados. Então, o `InnoDB` examina os arquivos de log para a frente a partir do ponto de controle, aplicando as modificações registradas no banco de dados.