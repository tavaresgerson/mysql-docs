## 17.2 InnoDB e o Modelo ACID

O modelo ACID é um conjunto de princípios de design de banco de dados que enfatizam aspectos de confiabilidade importantes para dados de negócios e aplicações críticas. O MySQL inclui componentes como o mecanismo de armazenamento `InnoDB` que aderem de perto ao modelo ACID, para que os dados não sejam corrompidos e os resultados não sejam distorcidos por condições excepcionais, como falhas de software e mau funcionamento do hardware. Quando você confia em recursos compatíveis com ACID, não precisa reinventar a roda da verificação de consistência e dos mecanismos de recuperação de falhas. Em casos em que você tem proteções de software adicionais, hardware ultra-confiável ou uma aplicação que pode tolerar uma pequena quantidade de perda de dados ou inconsistência, você pode ajustar as configurações do MySQL para trocar parte da confiabilidade ACID por maior desempenho ou capacidade de processamento.

As seções a seguir discutem como os recursos do MySQL, em particular o mecanismo de armazenamento `InnoDB`, interagem com as categorias do modelo ACID:

* **A**: atomicidade.
* **C**: consistência.
* **I:**: isolamento.
* **D**: durabilidade.

### Atomicidade

O aspecto **atomicidade** do modelo ACID envolve principalmente as transações `InnoDB`. Recursos relacionados do MySQL incluem:

* A configuração `autocommit`.
* A declaração `COMMIT`.
* A declaração `ROLLBACK`.

### Consistência

O aspecto **consistência** do modelo ACID envolve principalmente o processamento interno do `InnoDB` para proteger os dados de falhas. Recursos relacionados do MySQL incluem:

* O buffer de escrita dupla do `InnoDB`. Veja a Seção 17.6.4, “Buffer de Escrita Dupla”.

* A recuperação de falhas do `InnoDB`. Veja Recuperação de Falhas do `InnoDB`.

### Isolamento

O aspecto **isolamento** do modelo ACID envolve principalmente as transações `InnoDB`, em particular o nível de isolamento que se aplica a cada transação. Recursos relacionados do MySQL incluem:

* A configuração `autocommit`.
* Níveis de isolamento de transações e a instrução `SET TRANSACTION`. Consulte a Seção 17.7.2.1, “Níveis de Isolamento de Transações”.

* Os detalhes de nível baixo do bloqueio do `InnoDB`. Os detalhes podem ser visualizados nas tabelas do `INFORMATION_SCHEMA` (consulte a Seção 17.15.2, “Informações de Transação e Bloqueio do InnoDB INFORMATION_SCHEMA”) e nas tabelas `data_locks` e `data_lock_waits` do Schema de Desempenho.

### Durabilidade

O aspecto de **durabilidade** do modelo ACID envolve as funcionalidades do software MySQL interagindo com a sua configuração de hardware específica. Devido às muitas possibilidades dependendo das capacidades da sua CPU, rede e dispositivos de armazenamento, este aspecto é o mais complicado de fornecer diretrizes concretas para. (E essas diretrizes podem assumir a forma de “comprar novo hardware”). As funcionalidades relacionadas do MySQL incluem:

* O buffer de escrita dupla do `InnoDB`. Consulte a Seção 17.6.4, “Buffer de Escrita Dupla”.

* A variável `innodb_flush_log_at_trx_commit`.

* A variável `sync_binlog`.
* A variável `innodb_file_per_table`.

* O buffer de escrita em um dispositivo de armazenamento, como uma unidade de disco, SSD ou matriz RAID.

* Um cache com bateria em um dispositivo de armazenamento.
* O sistema operacional usado para executar o MySQL, em particular seu suporte à chamada de sistema `fsync()`.

* Uma fonte de alimentação ininterrupta (UPS) protegendo a energia elétrica para todos os servidores de computador e dispositivos de armazenamento que executam servidores MySQL e armazenam dados MySQL.

* Sua estratégia de backup, como frequência e tipos de backups, e períodos de retenção de backups.

* Para aplicações de dados distribuídas ou hospedadas, as características específicas dos centros de dados onde o hardware dos servidores MySQL está localizado e as conexões de rede entre os centros de dados.