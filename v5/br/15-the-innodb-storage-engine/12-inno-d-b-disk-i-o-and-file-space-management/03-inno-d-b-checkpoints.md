### 14.12.3 Pontos de verificação do InnoDB

Tornar seus arquivos de registro muito grandes pode reduzir o I/O do disco durante o checkpointing. Muitas vezes faz sentido definir o tamanho total dos arquivos de registro tão grande quanto o pool de buffers ou até maior. Embora, no passado, arquivos de registro grandes pudessem fazer com que a recuperação após falhas levasse muito tempo, a partir do MySQL 5.5, melhorias de desempenho na recuperação após falhas tornam possível o uso de arquivos de registro grandes com inicialização rápida após uma falha. (Estritamente falando, essa melhoria de desempenho está disponível para o MySQL 5.1 com o Plugin InnoDB 1.0.7 e versões superiores. É com o MySQL 5.5 que essa melhoria está disponível no motor de armazenamento InnoDB padrão.)

#### Como funciona o processamento de ponto de controle

O `InnoDB` implementa um mecanismo de verificação de ponto de controle conhecido como verificação de ponto de controle difusa. O `InnoDB` esvazia as páginas do banco de dados modificadas do pool de buffer em pequenos lotes. Não é necessário esvaziar o pool de buffer em um único lote, o que interromperia o processamento das instruções SQL do usuário durante o processo de verificação de ponto de controle.

Durante a recuperação de falhas, o `InnoDB` procura por uma etiqueta de ponto de verificação escrita nos arquivos de log. Ele sabe que todas as modificações no banco de dados antes da etiqueta estão presentes na imagem do disco do banco de dados. Em seguida, o `InnoDB` examina os arquivos de log a partir do ponto de verificação, aplicando as modificações registradas no banco de dados.
