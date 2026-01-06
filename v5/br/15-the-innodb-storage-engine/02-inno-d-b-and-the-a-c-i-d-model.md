## 14.2 InnoDB e o Modelo ACID

O modelo ACID é um conjunto de princípios de design de banco de dados que enfatizam aspectos da confiabilidade que são importantes para dados de negócios e aplicações críticas para a missão. O MySQL inclui componentes como o motor de armazenamento `InnoDB` que aderem de perto ao modelo ACID, para que os dados não sejam corrompidos e os resultados não sejam distorcidos por condições excepcionais, como falhas de software e mau funcionamento do hardware. Quando você confia em recursos compatíveis com ACID, não precisa reinventar a roda da verificação de consistência e dos mecanismos de recuperação de falhas. Em casos em que você tem proteções de software adicionais, hardware ultra-confiável ou uma aplicação que pode tolerar uma pequena quantidade de perda de dados ou inconsistência, você pode ajustar as configurações do MySQL para trocar parte da confiabilidade ACID por maior desempenho ou capacidade de processamento.

As seções a seguir discutem como os recursos do MySQL, em particular o mecanismo de armazenamento `InnoDB`, interagem com as categorias do modelo ACID:

- **A**: atomicidade.
- **C**: consistência.
- **Eu:**: isolamento.
- **D**: durabilidade.

### Atomicity

O aspecto de **atomicity** do modelo ACID envolve principalmente as transações do `InnoDB`. As características relacionadas do MySQL incluem:

- A configuração `autocommit`.
- A instrução `COMMIT`.
- A declaração `ROLLBACK`.

### Consistência

O aspecto de **consistência** do modelo ACID envolve principalmente o processamento interno do `InnoDB` para proteger os dados de falhas. As características relacionadas do MySQL incluem:

- O buffer de escrita dupla do `InnoDB`. Veja a Seção 14.6.5, “Buffer de Escrita Dupla”.

- Recuperação de falhas do `InnoDB`. Veja Recuperação de falhas do InnoDB.

### Isolamento

O aspecto de **isolamento** do modelo ACID envolve principalmente as transações do `InnoDB`, em particular o nível de isolamento que se aplica a cada transação. As funcionalidades relacionadas do MySQL incluem:

- A configuração `autocommit`.

- Níveis de isolamento de transações e a instrução `SET TRANSACTION`. Consulte a Seção 14.7.2.1, “Níveis de Isolamento de Transações”.

- Os detalhes de nível baixo do bloqueio do `InnoDB`. Os detalhes podem ser visualizados nas tabelas do `INFORMATION_SCHEMA`. Veja a Seção 14.16.2, “Informações de Transação e Bloqueio do INFORMATION\_SCHEMA do InnoDB”.

### Durabilidade

O aspecto de **durabilidade** do modelo ACID envolve as funcionalidades do software MySQL interagindo com a sua configuração de hardware específica. Devido às muitas possibilidades dependendo das capacidades da sua CPU, rede e dispositivos de armazenamento, este aspecto é o mais complicado de fornecer diretrizes concretas para. (E essas diretrizes podem assumir a forma de "comprar novo hardware"). As funcionalidades relacionadas do MySQL incluem:

- O buffer de escrita dupla do `InnoDB`. Veja a Seção 14.6.5, “Buffer de Escrita Dupla”.

- A variável `innodb_flush_log_at_trx_commit`.

- A variável `sync_binlog`.

- A variável `innodb_file_per_table`.

- O buffer de escrita em um dispositivo de armazenamento, como uma unidade de disco, SSD ou matriz RAID.

- Um cache com bateria em um dispositivo de armazenamento.

- O sistema operacional usado para executar o MySQL, em particular seu suporte à chamada de sistema `fsync()`.

- Um sistema de alimentação ininterrupta (UPS) que protege a energia elétrica de todos os servidores de computador e dispositivos de armazenamento que executam servidores MySQL e armazenam dados MySQL.

- Sua estratégia de backup, como a frequência e os tipos de backups, e os períodos de retenção dos backups.

- Para aplicações de dados distribuídos ou hospedadas, as características específicas dos centros de dados onde o hardware dos servidores MySQL está localizado e as conexões de rede entre os centros de dados.
