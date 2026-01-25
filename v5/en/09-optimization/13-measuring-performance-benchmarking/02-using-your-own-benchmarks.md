### 8.13.2 Usando Seus Próprios Benchmarks

Faça o Benchmark da sua aplicação e Database para descobrir onde estão os *bottlenecks*. Após corrigir um *bottleneck* (ou substituí-lo por um módulo “dummy”), você pode prosseguir para identificar o próximo *bottleneck*. Mesmo que o desempenho geral da sua aplicação seja aceitável atualmente, você deve, pelo menos, criar um plano para cada *bottleneck* e decidir como resolvê-lo se um dia você realmente precisar do desempenho extra.

Uma suíte de Benchmark gratuita é a Open Source Database Benchmark, disponível em <http://osdb.sourceforge.net/>.

É muito comum que um problema ocorra apenas quando o sistema está com uma *load* muito pesada. Tivemos muitos clientes que nos contataram quando tinham um sistema (testado) em produção e encontraram problemas de *load*. Na maioria dos casos, os problemas de desempenho acabam sendo devido a questões de design básico do Database (por exemplo, *table scans* não são boas sob alta *load*) ou problemas com o sistema operacional ou bibliotecas. Na maior parte do tempo, esses problemas seriam muito mais fáceis de corrigir se os sistemas não estivessem já em produção.

Para evitar problemas como este, faça o Benchmark de toda a sua aplicação sob a pior *load* possível:

* O programa **mysqlslap** pode ser útil para simular uma alta *load* produzida por múltiplos *clients* emitindo Queries simultaneamente. Veja Seção 4.5.8, “mysqlslap — Um Client de Emulação de Load”.

* Você também pode tentar pacotes de benchmarking como SysBench e DBT2, disponíveis em <https://launchpad.net/sysbench>, e <http://osdldbt.sourceforge.net/#dbt2>.

Esses programas ou pacotes podem levar um sistema ao colapso, portanto, certifique-se de usá-los apenas em seus sistemas de desenvolvimento.