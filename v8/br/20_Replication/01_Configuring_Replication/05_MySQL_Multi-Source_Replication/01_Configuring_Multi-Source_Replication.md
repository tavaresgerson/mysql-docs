#### 19.1.5.1 Configurando a Replicação de Múltiplas Fontes

Uma topologia de replicação de múltiplas fontes requer pelo menos duas fontes e uma replica configurada. Nesses tutoriais, assumimos que você tem duas fontes `source1` e `source2` e uma replica `replicahost`. A replica replica um banco de dados de cada uma das fontes, `db1` de `source1` e `db2` de `source2`.

As fontes em uma topologia de replicação de múltiplas fontes podem ser configuradas para usar a replicação baseada em GTID ou a replicação baseada na posição do log binário. Veja a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”, para saber como configurar uma fonte usando a replicação baseada em GTIDs. Veja a Seção 19.1.2.1, “Configurando a Configuração da Fonte de Replicação”, para saber como configurar uma fonte usando a replicação baseada na posição do arquivo.

As réplicas em uma topologia de replicação de múltiplas fontes exigem os repositórios `TABLE` para o repositório de metadados de conexão da réplica e o repositório de metadados do aplicador, que são os padrões no MySQL 8.0. A replicação de múltiplas fontes não é compatível com os repositórios de arquivos alternativos desatualizados.

Crie uma conta de usuário adequada em todas as fontes que a replica pode usar para se conectar. Você pode usar a mesma conta em todas as fontes ou uma conta diferente em cada uma. Se você criar uma conta apenas para fins de replicação, essa conta precisa apenas do privilégio `REPLICATION SLAVE`. Por exemplo, para configurar um novo usuário, `ted`, que pode se conectar a partir da replica `replicahost`, use o cliente **mysql** para emitir essas instruções em cada uma das fontes:

```
mysql> CREATE USER 'ted'@'replicahost' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'ted'@'replicahost';
```

Para obter mais detalhes e informações importantes sobre o plugin de autenticação padrão para novos usuários do MySQL 8.0, consulte a Seção 19.1.2.3, “Criando um Usuário para Replicação”.
