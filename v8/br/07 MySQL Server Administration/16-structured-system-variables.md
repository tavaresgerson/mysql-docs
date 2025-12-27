#### 7.1.9.5 Variáveis de Sistema Estruturadas

Uma variável estruturada difere de uma variável de sistema comum em dois aspectos:

* Seu valor é uma estrutura com componentes que especificam parâmetros do servidor considerados intimamente relacionados.
* Pode haver várias instâncias de um determinado tipo de variável estruturada. Cada uma tem um nome diferente e se refere a um recurso diferente mantido pelo servidor.

O MySQL suporta um tipo de variável estruturada, que especifica parâmetros que regem a operação de caches de chaves. Uma variável estruturada de cache de chaves tem esses componentes:

* `key_buffer_size`
* `key_cache_block_size`
* `key_cache_division_limit`
* `key_cache_age_threshold`

Esta seção descreve a sintaxe para referenciar variáveis estruturadas. As variáveis de cache de chaves são usadas para exemplos de sintaxe, mas detalhes específicos sobre como os caches de chaves operam são encontrados em outro lugar, na Seção 10.10.2, “O Cache de Chaves MyISAM”.

Para referenciar um componente de uma instância de uma variável estruturada, você pode usar um nome composto no formato *`instance_name.component_name`*. Exemplos:

```
hot_cache.key_buffer_size
hot_cache.key_cache_block_size
cold_cache.key_cache_block_size
```

Para cada variável de sistema estruturada, uma instância com o nome de `default` é sempre predefinida. Se você se referir a um componente de uma variável estruturada sem qualquer nome de instância, a instância `default` é usada. Assim, `default.key_buffer_size` e `key_buffer_size` referem-se ao mesmo variável de sistema.

As instâncias e componentes das variáveis estruturadas seguem estas regras de nomenclatura:

* Para um determinado tipo de variável estruturada, cada instância deve ter um nome que seja único *dentro* das variáveis desse tipo. No entanto, os nomes das instâncias não precisam ser únicos *entre* os tipos de variáveis estruturadas. Por exemplo, cada variável estruturada tem uma instância chamada `default`, então `default` não é único entre os tipos de variáveis.
* Os nomes dos componentes de cada tipo de variável estruturada devem ser únicos em todos os nomes de variáveis do sistema. Se isso não fosse verdade (ou seja, se dois tipos diferentes de variáveis estruturadas pudessem compartilhar nomes de membros de componentes), não seria claro qual variável estruturada padrão usar para referências a nomes de membros que não são qualificados por um nome de instância.
* Se o nome de uma instância de variável estruturada não for legal como um identificador não citado, consulte-o como um identificador citado usando aspas. Por exemplo, `hot-cache` não é legal, mas ```
$> mysqld --hot_cache.key_buffer_size=64K
```Mav4eY3xo6```
[mysqld]
hot_cache.key_buffer_size=64K
```diD5XTT2xP```
$> mysqld --key_buffer_size=256K \
         --extra_cache.key_buffer_size=128K \
         --extra_cache.key_cache_block_size=2048
```jI83bpIf9p```
$> mysqld --key_buffer_size=6M \
         --hot_cache.key_buffer_size=2M \
         --cold_cache.key_buffer_size=2M
```JklmZ3Y4Tq```
mysql> SET GLOBAL hot_cache.key_buffer_size = 10*1024*1024;
mysql> SET @@GLOBAL.hot_cache.key_buffer_size = 10*1024*1024;
```JOt1Kho0Js```
mysql> SELECT @@GLOBAL.hot_cache.key_buffer_size;
```XQs25vKs1T```
mysql> SHOW GLOBAL VARIABLES LIKE 'hot_cache.key_buffer_size';
```S3intlqSWL```

Esta é a exceção para poder usar nomes de variáveis estruturadas em qualquer lugar onde um nome de variável simples possa ocorrer.