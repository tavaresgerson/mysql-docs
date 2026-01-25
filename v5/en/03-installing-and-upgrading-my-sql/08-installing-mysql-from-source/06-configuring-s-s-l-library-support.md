### 2.8.6 Configurando o Suporte à Biblioteca SSL

Uma biblioteca SSL é necessária para o suporte a conexões criptografadas, entropia para geração de números aleatórios e outras operações relacionadas à criptografia. Seu sistema deve suportar OpenSSL ou yaSSL:

* Todas as distribuições binárias do MySQL Enterprise Edition são compiladas usando OpenSSL. Não é possível usar yaSSL com o MySQL Enterprise Edition.

* Antes do MySQL 5.7.28, as distribuições binárias do MySQL Community Edition eram compiladas usando yaSSL. A partir do MySQL 5.7.28, o suporte ao yaSSL foi removido e todas as *builds* do MySQL usam OpenSSL.

* Antes do MySQL 5.7.28, as distribuições de código-fonte do MySQL Community Edition podiam ser compiladas usando OpenSSL ou yaSSL. A partir do MySQL 5.7.28, o suporte ao yaSSL foi removido.

Se você compilar o MySQL a partir de uma distribuição de código-fonte, o **CMake** configura a distribuição para usar a biblioteca OpenSSL instalada por padrão.

Para compilar usando OpenSSL, utilize este procedimento:

1. Certifique-se de que o OpenSSL 1.0.1 ou mais recente esteja instalado no seu sistema. Se a versão do OpenSSL instalada for anterior a 1.0.1, o **CMake** produzirá um erro no momento da configuração do MySQL. Se for necessário obter o OpenSSL, visite <http://www.openssl.org>.

2. A opção `WITH_SSL` do **CMake** determina qual biblioteca SSL usar para compilar o MySQL (consulte a Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”). O padrão é `-DWITH_SSL=system`, que usa OpenSSL. Para tornar isso explícito, especifique essa opção. Por exemplo:

   ```sql
   cmake . -DWITH_SSL=system
   ```

   Esse comando configura a distribuição para usar a biblioteca OpenSSL instalada. Alternativamente, para especificar explicitamente o nome do *path* (caminho) para a instalação do OpenSSL, use a seguinte sintaxe. Isso pode ser útil se você tiver várias versões do OpenSSL instaladas, para evitar que o **CMake** escolha a errada:

   ```sql
   cmake . -DWITH_SSL=path_name
   ```

3. Compile e instale a distribuição.

Para verificar se um servidor **mysqld** suporta conexões criptografadas, examine o valor da variável de sistema `have_ssl`:

```sql
mysql> SHOW VARIABLES LIKE 'have_ssl';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| have_ssl      | YES   |
+---------------+-------+
```

Se o valor for `YES`, o servidor suporta conexões criptografadas. Se o valor for `DISABLED`, o servidor é capaz de suportar conexões criptografadas, mas não foi iniciado com as opções `--ssl-xxx` apropriadas para permitir que conexões criptografadas sejam utilizadas; consulte a Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

Para determinar se um servidor foi compilado usando OpenSSL ou yaSSL, verifique a existência de qualquer uma das variáveis de sistema ou de *status* que estão presentes apenas para OpenSSL. Consulte a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.