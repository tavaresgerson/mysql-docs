## 12.3 Especificação de Conjuntos de Caracteres e Colagens

12.3.1 Convenções de Nomenclatura de Collation

12.3.2 Conjunto de caracteres e codificação do servidor

12.3.3 Conjunto de caracteres e classificação de banco de dados

12.3.4 Conjunto de caracteres da tabela e classificação

12.3.5 Conjunto de caracteres da coluna e classificação

12.3.6 Conjunto de caracteres de literal de cadeia de caracteres e classificação

12.3.7 O Conjunto Nacional de Caracteres

12.3.8 Introdutores de Conjunto de Caracteres

12.3.9 Exemplos de Conjunto de Caracteres e Atribuição de Codificação

12.3.10 Compatibilidade com outros SGBDs

Existem configurações padrão para conjuntos de caracteres e coligações em quatro níveis: servidor, banco de dados, tabela e coluna. A descrição nas seções a seguir pode parecer complexa, mas na prática, descobriu-se que a definição padrão em vários níveis resulta em resultados naturais e óbvios.

`CHARACTER SET` é usado em cláusulas que especificam um conjunto de caracteres. `CHARSET` pode ser usado como sinônimo de `CHARACTER SET`.

Problemas com o conjunto de caracteres afetam não apenas o armazenamento de dados, mas também a comunicação entre os programas cliente e o servidor MySQL. Se você deseja que o programa cliente se comunique com o servidor usando um conjunto de caracteres diferente do padrão, é necessário indicar qual é. Por exemplo, para usar o conjunto de caracteres Unicode `latin1`, execute esta declaração após se conectar ao servidor:

```
SET NAMES 'latin1';
```

Para obter mais informações sobre problemas relacionados ao conjunto de caracteres na comunicação cliente/servidor, consulte a Seção 12.4, “Conjunto de caracteres de conexão e colagens”.
