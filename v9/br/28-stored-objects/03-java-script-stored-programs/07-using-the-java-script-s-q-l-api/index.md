### 27.3.7 Uso da API SQL JavaScript

27.3.7.1 Declarações Simples

27.3.7.2 Declarações Preparadas

27.3.7.3 Trabalhando com Dados e Metadados

Esta seção discute o uso da API para executar e obter e processar resultados de declarações SQL simples e preparadas. A execução de SQL em JavaScript está disponível apenas em procedimentos armazenados e não em funções armazenadas.

A API SQL suporta dois tipos de declarações: declarações SQL simples (consulte a Seção 27.3.7.1, “Declarações Simples”) e declarações preparadas (Seção 27.3.7.2, “Declarações Preparadas”). As declarações preparadas suportam parâmetros vinculados; as declarações simples não.

O número máximo de declarações simples que podem ser abertas simultaneamente para execução de procedimentos armazenados em uma sessão dada é de 1024. Esse número é fixo e não configurável pelo usuário. Tentar executar mais declarações simples do que esse número ao mesmo tempo gera um erro. As declarações preparadas executadas em JavaScript contam para o limite global determinado por `max_prepared_stmt_count`; consulte a descrição dessa variável para mais informações.

O conjunto de resultados retornado por uma declaração SQL é armazenado em memória. Para uma declaração simples, o tamanho do conjunto de resultados (inteiro) é limitado a 1 MB; para uma declaração preparada, qualquer linha individual pode consumir até 1 MB. Em qualquer caso, exceder o limite gera um erro.

Independentemente do tipo de declaração, dois mecanismos estão disponíveis para consumir resultados. O conjunto de resultados pode ser processado dentro do JavaScript ou pode ser passado diretamente ao cliente. Consulte Conjuntos de Resultados para mais informações.

Você também pode acessar dados de sessão, como tabelas temporárias, variáveis de sessão e estado de transação. Variáveis de sessão declaradas fora de procedimentos armazenados podem ser acessadas dentro deles; o mesmo vale para tabelas temporárias. Além disso, uma transação iniciada fora de um procedimento armazenado pode ser confirmada dentro dele.

Uma declaração que produz um conjunto de resultados contendo tipos de dados não suportados resulta em um erro de tipo não suportado. Por exemplo, declarações que envolvem `DESCRIBE`, `EXPLAIN` ou `ANALYZE TABLE` são afetadas por essa limitação, como mostrado aqui:

```
mysql> CALL jssp_simple("DESCRIBE t1");
ERROR 6113 (HY000): JavaScript> Unsupported type BLOB/TEXT for 'Type'
mysql> SHOW WARNINGS;
+-------+------+---------------------------------------------------+
| Level | Code | Message                                           |
+-------+------+---------------------------------------------------+
| Error | 6113 | JavaScript> Unsupported type BLOB/TEXT for 'Type' |
+-------+------+---------------------------------------------------+
1 row in set (0.00 sec)
```

Definir uma variável local JavaScript a partir de uma declaração SQL dentro de um procedimento armazenado não é suportado.

A API também suporta múltiplos conjuntos de resultados, como os produzidos quando um procedimento armazenado chama outro. Consultas de múltiplos comandos não são suportadas e produzem um erro de sintaxe.

Alguns dos exemplos nesta seção são baseados no banco de dados `world` disponível no site da MySQL. Para obter ajuda para instalar o banco de dados a partir do arquivo de download, consulte a Seção 6.5.1.5, “Executando declarações SQL a partir de um arquivo de texto”.