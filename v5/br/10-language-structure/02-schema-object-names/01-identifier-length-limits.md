### 9.2.1 Limites de comprimento do identificador

A tabela a seguir descreve a extensão máxima para cada tipo de identificador.

<table summary="O comprimento máximo para cada tipo de identificador de objeto do MySQL."><col style="width: 15%"/><col style="width: 15%"/><thead><tr> <th>Tipo de identificador</th> <th>Comprimento máximo (caracteres)</th> </tr></thead><tbody><tr> <td>Banco de dados</td> <td>64 ([[<code>NDB</code>]]motor de armazenamento: 63)</td> </tr><tr> <td>Tabela</td> <td>64 ([[<code>NDB</code>]]motor de armazenamento: 63)</td> </tr><tr> <td>Coluna</td> <td>64</td> </tr><tr> <td>Índice</td> <td>64</td> </tr><tr> <td>Restrição</td> <td>64</td> </tr><tr> <td>Programa armazenado</td> <td>64</td> </tr><tr> <td>Visualização</td> <td>64</td> </tr><tr> <td>Tablespace</td> <td>64</td> </tr><tr> <td>Servidor</td> <td>64</td> </tr><tr> <td>Grupo de Arquivos de Registro</td> <td>64</td> </tr><tr> <td>Alias</td> <td>256 (ver exceção após a tabela)</td> </tr><tr> <td>Etiqueta de Declaração Composta</td> <td>16</td> </tr><tr> <td>Variável Definida pelo Usuário</td> <td>64</td> </tr></tbody></table>

Os alias para os nomes das colunas nas declarações `CREATE VIEW` são verificados contra o comprimento máximo da coluna de 64 caracteres (e não o comprimento máximo do alias de 256 caracteres).

Para definições de restrições que não incluem nenhum nome de restrição, o servidor gera internamente um nome derivado do nome da tabela associada. Por exemplo, os nomes de restrições de chave estrangeira gerados internamente consistem no nome da tabela mais `_ibfk_` e um número. Se o nome da tabela estiver próximo do limite de comprimento para nomes de restrições, os caracteres adicionais necessários para o nome da restrição podem fazer com que o nome exceda o limite, resultando em um erro.

Os identificadores são armazenados usando Unicode (UTF-8). Isso se aplica a identificadores em definições de tabelas que são armazenados em arquivos `.frm` e a identificadores armazenados nas tabelas de concessão no banco de dados `mysql`. Os tamanhos das colunas de strings de identificadores nas tabelas de concessão são medidos em caracteres. Você pode usar caracteres multibyte sem reduzir o número de caracteres permitidos para valores armazenados nessas colunas.

O NDB Cluster impõe um comprimento máximo de 63 caracteres para os nomes de bancos de dados e tabelas. Consulte a Seção 21.2.7.5, “Limites associados aos objetos de banco de dados no NDB Cluster”.

Valores como nome de usuário e nomes de host nos nomes de contas do MySQL são strings e não identificadores. Para obter informações sobre o comprimento máximo desses valores armazenados em tabelas de concessão, consulte Propriedades de Colunas de Alcance da Tabela de Concessão.
