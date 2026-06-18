#### 20.8.3.4 Atualização da Replicação em Grupo com mysqlbackup

Como parte de uma abordagem de provisionamento, você pode usar o MySQL Enterprise Backup para copiar e restaurar os dados de um membro do grupo para novos membros. No entanto, você não pode usar essa técnica para restaurar diretamente um backup feito de um membro que está executando uma versão mais antiga do MySQL para um membro que está executando uma versão mais recente do MySQL. A solução é restaurar o backup para uma nova instância do servidor que esteja executando a mesma versão do MySQL que o membro do qual o backup foi feito, e depois atualizar a instância. Esse processo consiste em:

- Faça um backup de um membro do grupo mais antigo usando **mysqlbackup**. Veja a Seção 20.5.6, “Usando o MySQL Enterprise Backup com a Replicação de Grupo”.

- Implante uma nova instância do servidor, que deve estar executando a mesma versão do MySQL que o membro mais antigo onde o backup foi feito.

- Restaure o backup do membro mais antigo para a nova instância usando **mysqlbackup**.

- Atualize o MySQL na nova instância, consulte o Capítulo 3, *Atualizando o MySQL*.

Repita esse processo para criar um número adequado de novas instâncias, por exemplo, para poder lidar com uma falha de replicação. Em seguida, junte as instâncias a um grupo com base na Seção 20.8.3.3, “Métodos de Atualização de Replicação Online em Grupo”.
