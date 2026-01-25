### 14.12.3 Checkpoints do InnoDB

Tornar seus *log files* muito grandes pode reduzir o *disk I/O* durante o *checkpointing*. Muitas vezes, faz sentido definir o tamanho total dos *log files* tão grande quanto o *buffer pool* ou até maior. Embora no passado *log files* grandes pudessem fazer com que o *crash recovery* demorasse um tempo excessivo, a partir do MySQL 5.5, melhorias de desempenho no *crash recovery* tornam possível usar *log files* grandes com inicialização rápida após uma falha (*crash*). (Rigidamente falando, esta melhoria de desempenho está disponível para MySQL 5.1 com o InnoDB Plugin 1.0.7 ou superior. É com o MySQL 5.5 que esta melhoria está disponível no *storage engine* InnoDB padrão.)

#### Como Funciona o Processamento de Checkpoint

O `InnoDB` implementa um mecanismo de *checkpoint* conhecido como *fuzzy checkpointing*. O `InnoDB` descarrega (*flushes*) páginas de *Database* modificadas do *buffer pool* em pequenos lotes (*batches*). Não há necessidade de descarregar (*flush*) o *buffer pool* em um único lote, o que interromperia o processamento de comandos *SQL* do usuário durante o processo de *checkpointing*.

Durante o *crash recovery*, o `InnoDB` procura por um rótulo de *checkpoint* gravado nos *log files*. Ele sabe que todas as modificações no *Database* anteriores ao rótulo estão presentes na imagem em *disk* do *Database*. Em seguida, o `InnoDB` examina (*scans*) os *log files* adiante a partir do *checkpoint*, aplicando as modificações registradas no *Database*.