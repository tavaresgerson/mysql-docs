#### 5.1.8.3 Variáveis de Sistema Estruturadas

Uma variável estruturada difere de uma variável de sistema regular em dois aspectos:

* Seu valor é uma estrutura com componentes que especificam parâmetros do server considerados intimamente relacionados.

* Pode haver várias instâncias de um determinado tipo de variável estruturada. Cada uma tem um nome diferente e se refere a um recurso diferente mantido pelo server.

O MySQL suporta um tipo de variável estruturada, que especifica parâmetros que governam a operação de key caches. Uma variável estruturada de key cache possui estes componentes:

* [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size)
* [`key_cache_block_size`](server-system-variables.html#sysvar_key_cache_block_size)
* [`key_cache_division_limit`](server-system-variables.html#sysvar_key_cache_division_limit)
* [`key_cache_age_threshold`](server-system-variables.html#sysvar_key_cache_age_threshold)

Esta seção descreve a sintaxe para fazer referência a variáveis estruturadas. Variáveis de Key Cache são usadas para exemplos de sintaxe, mas detalhes específicos sobre como os key caches operam são encontrados em outro lugar, na [Seção 8.10.2, “O MyISAM Key Cache”](myisam-key-cache.html "8.10.2 The MyISAM Key Cache").

Para fazer referência a um componente de uma instância de variável estruturada, você pode usar um nome composto no formato *`instance_name.component_name`*. Exemplos:

```sql
hot_cache.key_buffer_size
hot_cache.key_cache_block_size
cold_cache.key_cache_block_size
```

Para cada variável de sistema estruturada, uma instância com o nome `default` é sempre predefinida. Se você fizer referência a um componente de uma variável estruturada sem nenhum nome de instância, a instância `default` é usada. Assim, `default.key_buffer_size` e [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) referem-se à mesma variável de sistema.

Instâncias e componentes de variáveis estruturadas seguem estas regras de nomenclatura:

* Para um determinado tipo de variável estruturada, cada instância deve ter um nome que seja único *dentro* das variáveis desse tipo. No entanto, os nomes das instâncias não precisam ser únicos *entre* os tipos de variáveis estruturadas. Por exemplo, cada variável estruturada tem uma instância chamada `default`, portanto, `default` não é única entre os tipos de variáveis.

* Os nomes dos componentes de cada tipo de variável estruturada devem ser únicos em todos os nomes de variáveis de sistema. Se isso não fosse verdade (isto é, se dois tipos diferentes de variáveis estruturadas pudessem compartilhar nomes de membros componentes), não estaria claro qual variável estruturada *default* usar para referências a nomes de membros que não são qualificados por um nome de instância.

* Se um nome de instância de variável estruturada não for legal como um identificador não entre aspas, faça referência a ele como um identificador entre aspas usando backticks. Por exemplo, `hot-cache` não é legal, mas `` `hot-cache` `` é.

* `global`, `session` e `local` não são nomes de instâncias legais. Isso evita um conflito com notações como `@@GLOBAL.var_name` para fazer referência a variáveis de sistema não estruturadas.

Atualmente, não há possibilidade de as duas primeiras regras serem violadas porque o único tipo de variável estruturada é o dos key caches. Essas regras podem assumir maior significado se algum outro tipo de variável estruturada for criado no futuro.

Com uma exceção, você pode fazer referência a componentes de variáveis estruturadas usando nomes compostos em qualquer contexto onde nomes de variáveis simples possam ocorrer. Por exemplo, você pode atribuir um valor a uma variável estruturada usando uma opção de linha de comando:

```sql
$> mysqld --hot_cache.key_buffer_size=64K
```

Em um arquivo de opções, use esta sintaxe:

```sql
[mysqld]
hot_cache.key_buffer_size=64K
```

Se você iniciar o server com esta opção, ele cria um key cache chamado `hot_cache` com um size de 64KB, além do key cache *default* que tem um size *default* de 8MB.

Suponha que você inicie o server da seguinte forma:

```sql
$> mysqld --key_buffer_size=256K \
         --extra_cache.key_buffer_size=128K \
         --extra_cache.key_cache_block_size=2048
```

Neste caso, o server define o size do key cache *default* para 256KB. (Você também poderia ter escrito `--default.key_buffer_size=256K`.) Além disso, o server cria um segundo key cache chamado `extra_cache` com um size de 128KB, com o size dos block buffers para cache de table Index blocks definido como 2048 bytes.

O exemplo a seguir inicia o server com três key caches diferentes, com sizes em uma proporção de 3:1:1:

```sql
$> mysqld --key_buffer_size=6M \
         --hot_cache.key_buffer_size=2M \
         --cold_cache.key_buffer_size=2M
```

Os valores de variáveis estruturadas também podem ser definidos e recuperados em runtime. Por exemplo, para definir um key cache chamado `hot_cache` para um size de 10MB, use uma destas instruções:

```sql
mysql> SET GLOBAL hot_cache.key_buffer_size = 10*1024*1024;
mysql> SET @@GLOBAL.hot_cache.key_buffer_size = 10*1024*1024;
```

Para recuperar o cache size, faça isto:

```sql
mysql> SELECT @@GLOBAL.hot_cache.key_buffer_size;
```

No entanto, a seguinte instrução não funciona. A variável não é interpretada como um nome composto, mas sim como uma string simples para uma operação de pattern-matching [`LIKE`](string-comparison-functions.html#operator_like):

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'hot_cache.key_buffer_size';
```

Esta é a exceção para poder usar nomes de variáveis estruturadas em qualquer lugar onde um nome de variável simples possa ocorrer.