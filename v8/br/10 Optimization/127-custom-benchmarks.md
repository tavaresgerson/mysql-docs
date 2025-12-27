### 10.13.2 Usando Seus Próprios Padrões de Referência

Faça uma comparação de desempenho de sua aplicação e banco de dados para descobrir onde estão os gargalos. Após corrigir um gargalo (ou substituí-lo por um módulo "fantoche"), você pode prosseguir para identificar o próximo gargalo. Mesmo que o desempenho geral de sua aplicação seja aceitável atualmente, você deve, pelo menos, fazer um plano para cada gargalo e decidir como resolvê-lo se, um dia, você realmente precisar do desempenho extra.

Uma suíte de benchmark de código aberto é o Benchmark de Banco de Dados de Código Aberto, disponível em <http://osdb.sourceforge.net/>.

É muito comum que um problema ocorra apenas quando o sistema está muito sobrecarregado. Temos tido muitos clientes que nos contatam quando têm um sistema (testado) em produção e enfrentaram problemas de carga. Na maioria dos casos, os problemas de desempenho resultam de questões de design básico do banco de dados (por exemplo, varreduras de tabelas não são boas sob alta carga) ou problemas com o sistema operacional ou bibliotecas. Na maioria das vezes, esses problemas seriam muito mais fáceis de resolver se os sistemas não estivessem já em produção.

Para evitar problemas como esse, faça uma comparação de desempenho de toda a sua aplicação sob a carga mais ruim possível:

* O programa `mysqlslap` pode ser útil para simular uma alta carga produzida por vários clientes fazendo consultas simultaneamente. Veja  Seção 6.5.7, “mysqlslap — Um Cliente de Emulação de Carga”.
* Você também pode tentar fazer uma comparação de desempenho com pacotes como SysBench e DBT2, disponíveis em <https://launchpad.net/sysbench>, e <http://osdldbt.sourceforge.net/#dbt2>.

Esses programas ou pacotes podem derrubar um sistema, então certifique-se de usá-los apenas em seus sistemas de desenvolvimento.