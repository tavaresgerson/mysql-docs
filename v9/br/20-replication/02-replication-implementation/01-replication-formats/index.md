### 19.2.1 Formas de replicação

19.2.1.1 Vantagens e desvantagens da replicação baseada em declarações e baseada em linhas

19.2.1.2 Uso do registro e replicação baseados em linhas

19.2.1.3 Determinação de declarações seguras e inseguras no registro binário

A replicação funciona porque os eventos escritos no log binário são lidos da fonte e processados na replica. Os eventos são registrados no log binário em diferentes formatos de acordo com o tipo de evento. Os diferentes formatos de replicação usados correspondem ao formato de registro binário usado quando os eventos foram registrados no log binário da fonte. A correlação entre os formatos de registro binário e os termos usados durante a replicação é:

* Ao usar o registro binário baseada em declarações, a fonte escreve declarações SQL no log binário. A replicação da fonte para a replica funciona executando as declarações SQL na replica. Isso é chamado de replicação baseada em declarações (que pode ser abreviado como SBR), que corresponde ao formato de registro binário baseada em declarações do MySQL.

* Ao usar o registro baseada em linhas, a fonte escreve eventos no log binário que indicam como as linhas individuais da tabela são alteradas. A replicação da fonte para a replica funciona copiando os eventos que representam as alterações nas linhas da tabela para a replica. Isso é chamado de replicação baseada em linhas (que pode ser abreviado como RBR).

O registro baseada em linhas é o método padrão.

* Você também pode configurar o MySQL para usar uma combinação de registro baseado em instruções e baseado em linhas, dependendo de qual seja mais apropriado para o registro da mudança. Isso é chamado de registro de formato misto. Ao usar o registro de formato misto, um registro baseado em instruções é usado por padrão. Dependendo de certas instruções e também do mecanismo de armazenamento sendo usado, o registro é automaticamente alterado para baseado em linhas em casos específicos. A replicação usando o formato misto é referida como replicação baseada em formato misto ou replicação de formato misto. Para mais informações, consulte a Seção 7.4.4.3, “Formato de Registro Binário Misto”.

**NBD Cluster.** O formato de registro binário padrão no MySQL NDB Cluster 9.5 é `ROW`. A replicação do NDB Cluster usa replicação baseada em linhas; o mecanismo de armazenamento `NDB` é incompatível com a replicação baseada em instruções. Consulte a Seção 25.7.2, “Requisitos Gerais para a Replicação do NDB Cluster”, para mais informações.

Ao usar o formato `MIXED`, o formato de registro binário é determinado em parte pelo mecanismo de armazenamento sendo usado e pela instrução sendo executada. Para mais informações sobre o registro de formato misto e as regras que regem o suporte a diferentes formatos de registro, consulte a Seção 7.4.4.3, “Formato de Registro Binário Misto”.

O formato de registro em um servidor MySQL em execução é controlado definindo a variável de sistema `binlog_format`. Essa variável pode ser definida com escopo de sessão ou global. As regras que regem quando e como o novo ajuste entra em vigor são as mesmas para outras variáveis de sistema do servidor MySQL. Definir a variável para a sessão atual dura apenas até o final dessa sessão, e a mudança não é visível para outras sessões. Definir a variável globalmente entra em vigor para clientes que se conectam após a mudança, mas não para nenhuma sessão de cliente atual, incluindo a sessão onde a definição da variável foi alterada. Para tornar a definição da variável de sistema global permanente, para que ela seja aplicada em reinicializações do servidor, você deve defini-la em um arquivo de opção. Para mais informações, consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Existem condições sob as quais você não pode alterar o formato de registro binário em tempo de execução ou fazer isso faz com que a replicação falhe. Veja a Seção 7.4.4.2, “Definindo o Formato do Log Binário”.

Alterar o valor global da variável `binlog_format` requer privilégios suficientes para definir variáveis de sistema globais. Alterar o valor da variável `binlog_format` de sessão requer privilégios suficientes para definir variáveis de sistema de sessão restritas. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Observação

Alterar o formato de registro binário (`binlog_format` variável de sistema) foi descontinuado no MySQL 8.0; em uma versão futura do MySQL, você pode esperar que `binlog_format` seja removido completamente, e o formato baseado em linhas se torne o único formato de registro usado pelo MySQL.

Os formatos de replicação baseados em declarações e baseados em linhas têm problemas e limitações diferentes. Para uma comparação de suas vantagens e desvantagens relativas, consulte a Seção 19.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Declarações e Baseada em Linhas”.

Com a replicação baseada em declarações, você pode encontrar problemas ao replicar rotinas ou gatilhos armazenados. Você pode evitar esses problemas usando a replicação baseada em linhas. Para mais informações, consulte a Seção 27.9, “Registro de Binário de Programas Armazenados”.