#### 21.6.7.2 Adicionando nós de dados do NDB Cluster Online: procedimento básico

Nesta seção, listamos os passos básicos necessários para adicionar novos nós de dados a um NDB Cluster. Este procedimento se aplica se você estiver usando os binários **ndbd** ou **ndbmtd** para os processos dos nós de dados. Para um exemplo mais detalhado, consulte Seção 21.6.7.3, “Adicionando Nodos de Dados do NDB Cluster Online: Exemplo Detalhado”.

Supondo que você já tenha um NDB Cluster em execução, adicionar nós de dados online requer as seguintes etapas:

1. Editar o arquivo de configuração do clúster `config.ini`, adicionando novas seções `[ndbd]` correspondentes aos nós a serem adicionados. No caso em que o clúster usa vários servidores de gerenciamento, essas alterações precisam ser feitas em todos os arquivos `config.ini` usados pelos servidores de gerenciamento.

   Você deve ter cuidado para que os IDs dos nós de quaisquer novos nós de dados adicionados no arquivo `config.ini` não sobreponham os IDs dos nós usados pelos nós existentes. No caso de você ter nós de API usando IDs de nó alocados dinamicamente e esses IDs corresponderem aos IDs de nó que você deseja usar para novos nós de dados, é possível forçar esses nós de API a “migrar”, conforme descrito mais adiante neste procedimento.

2. Realize um reinício em andamento de todos os servidores de gerenciamento do NDB Cluster.

   Importante

   Todos os servidores de gerenciamento devem ser reiniciados com a opção `--reload` ou `--initial` para forçar a leitura da nova configuração.

3. Realize um reinício contínuo de todos os nós de dados do NDB Cluster existentes. Não é necessário (ou geralmente desejável) usar `--initial` ao reiniciar os nós de dados existentes.

   Se você estiver usando nós da API com IDs dinamicamente alocados que correspondem a quaisquer IDs de nó que você deseja atribuir a novos nós de dados, você deve reiniciar todos os nós da API (incluindo nós SQL) antes de reiniciar qualquer um dos processos dos nós de dados nesta etapa. Isso faz com que quaisquer nós da API com IDs de nó que não foram explicitamente atribuídos anteriormente desistam desses IDs de nó e adquira novos.

4. Realize um reinício contínuo de quaisquer nós SQL ou API conectados ao NDB Cluster.

5. Comece os novos nós de dados.

   Os novos nós de dados podem ser iniciados em qualquer ordem. Eles também podem ser iniciados simultaneamente, desde que sejam iniciados após a conclusão dos reinícios contínuos de todos os nós de dados existentes e antes de prosseguir para o próximo passo.

6. Execute um ou mais comandos `CREATE NODEGROUP` no cliente de gerenciamento do NDB Cluster para criar o novo grupo de nós ou os grupos de nós aos quais os novos nós de dados pertencem.

7. Redistribua os dados do clúster entre todos os nós de dados, incluindo os novos. Normalmente, isso é feito emitindo uma declaração `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` no cliente **mysql** para cada tabela **NDBCLUSTER**.

   *Exceção*: Para tabelas criadas usando a opção `MAX_ROWS`, essa instrução não funciona; em vez disso, use `ALTER TABLE ... ALGORITHM=INPLACE MAX_ROWS=...` para reorganizar essas tabelas. Você também deve ter em mente que usar `MAX_ROWS` para definir o número de partições dessa maneira é desaconselhável no NDB 7.5.4 e versões posteriores, onde você deve usar `PARTITION_BALANCE`; consulte Seção 13.1.18.9, “Definindo opções de comentário do NDB” para obter mais informações.

   Nota

   Isso deve ser feito apenas para tabelas que já existiam no momento em que o novo grupo de nós foi adicionado. Os dados nas tabelas criadas após a adição do novo grupo de nós são distribuídos automaticamente; no entanto, os dados adicionados a qualquer tabela `tbl` que já existia antes dos novos nós serem adicionados não são distribuídos usando os novos nós até que a tabela tenha sido reorganizada.

8. `ALTER TABLE ... REORGANIZE PARTITION ALGORITHM=INPLACE` reorganiza as partições, mas não recupera o espaço liberado nos nós "velhos". Você pode fazer isso emitindo, para cada tabela `NDBCLUSTER`, uma instrução `OPTIMIZE TABLE` no cliente **mysql**.

   Isso funciona para o espaço usado por colunas de largura variável de tabelas `NDB` de memória. A instrução `OPTIMIZE TABLE` não é suportada para colunas de largura fixa de tabelas de memória; também não é suportada para tabelas de dados em disco.

Você pode adicionar todos os nós desejados e, em seguida, emitir vários comandos `CREATE NODEGROUP` consecutivamente para adicionar os novos grupos de nós ao clúster.
