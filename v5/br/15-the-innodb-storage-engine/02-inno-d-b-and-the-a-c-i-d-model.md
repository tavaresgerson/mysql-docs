## 14.2 InnoDB e o Modelo ACID

O modelo ACID é um conjunto de princípios de design de Database que enfatizam aspectos de confiabilidade importantes para dados corporativos e aplicações de missão crítica. O MySQL inclui componentes, como o storage engine `InnoDB`, que aderem estritamente ao modelo ACID para que os dados não sejam corrompidos e os resultados não sejam distorcidos por condições excepcionais, como falhas de software (crashes) e mau funcionamento de hardware (malfunctions). Ao depender de recursos compatíveis com ACID, você não precisa reinventar a roda dos mecanismos de verificação de consistência e crash recovery. Em casos em que você possui salvaguardas de software adicionais, hardware ultraconfiável, ou uma aplicação que pode tolerar uma pequena quantidade de perda de dados ou inconsistência, você pode ajustar as configurações do MySQL para trocar parte da confiabilidade ACID por maior performance ou throughput.

As seções a seguir discutem como os recursos do MySQL, em particular o storage engine `InnoDB`, interagem com as categorias do modelo ACID:

* **A**: atomicidade (atomicity).
* **C**: consistência (consistency).
* **I:**: isolamento (isolation).
* **D**: durabilidade (durability).

### Atomicidade

O aspecto de **atomicidade** do modelo ACID envolve principalmente as transactions do `InnoDB`. Os recursos relacionados do MySQL incluem:

* A configuração `autocommit`.
* O statement `COMMIT`.
* O statement `ROLLBACK`.

### Consistência

O aspecto de **consistência** do modelo ACID envolve principalmente o processamento interno do `InnoDB` para proteger os dados contra crashes. Os recursos relacionados do MySQL incluem:

* O doublewrite buffer do `InnoDB`. Consulte a Seção 14.6.5, “Doublewrite Buffer”.

* O crash recovery do `InnoDB`. Consulte InnoDB Crash Recovery.

### Isolamento

O aspecto de **isolamento** do modelo ACID envolve principalmente as transactions do `InnoDB`, em particular o isolation level que se aplica a cada transaction. Os recursos relacionados do MySQL incluem:

* A configuração `autocommit`.
* Os isolation levels de Transaction e o statement `SET TRANSACTION`. Consulte a Seção 14.7.2.1, “Transaction Isolation Levels”.

* Os detalhes de baixo nível do locking do `InnoDB`. Os detalhes podem ser visualizados nas tabelas `INFORMATION_SCHEMA`. Consulte a Seção 14.16.2, “InnoDB INFORMATION_SCHEMA Transaction and Locking Information”.

### Durabilidade

O aspecto de **durabilidade** do modelo ACID envolve recursos de software do MySQL interagindo com sua configuração de hardware específica. Devido às muitas possibilidades, dependendo dos recursos de sua CPU, network e storage devices, este aspecto é o mais complicado para fornecer diretrizes concretas. (E essas diretrizes podem tomar a forma de “comprar novo hardware”). Os recursos relacionados do MySQL incluem:

* O doublewrite buffer do `InnoDB`. Consulte a Seção 14.6.5, “Doublewrite Buffer”.

* A variável `innodb_flush_log_at_trx_commit`.

* A variável `sync_binlog`.
* A variável `innodb_file_per_table`.

* O write buffer em um storage device, como um disco rígido (disk drive), SSD ou array RAID.

* Um cache com bateria (battery-backed cache) em um storage device.
* O operating system usado para executar o MySQL, em particular seu suporte para a system call `fsync()`.

* Uma fonte de alimentação ininterrupta (UPS - uninterruptible power supply) protegendo a energia elétrica de todos os servidores de computador e storage devices que executam servidores MySQL e armazenam dados do MySQL.

* Sua estratégia de backup, como frequência e tipos de backups, e períodos de retenção de backup.

* Para aplicações de dados distribuídas ou hospedadas, as características específicas dos data centers onde o hardware para os servidores MySQL está localizado, e as network connections entre os data centers.