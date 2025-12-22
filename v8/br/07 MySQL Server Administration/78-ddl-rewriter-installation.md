#### 7.6.5.1 Instalar ou Desinstalar ddl\_rewriter

Esta seção descreve como instalar ou desinstalar o plug-in `ddl_rewriter`.

::: info Note

Se instalado, o plug-in `ddl_rewriter` envolve algum custo mínimo mesmo quando desativado. Para evitar esse custo, instale `ddl_rewriter` apenas para o período durante o qual você pretende usá-lo.

O caso de uso principal é a modificação de instruções restauradas a partir de arquivos de despejo, então o padrão de uso típico é: 1) Instalar o plugin; 2) restaurar o arquivo ou arquivos de despejo; 3) desinstalar o plugin.

:::

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório de plugins do MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório de plugins definindo o valor de `plugin_dir` na inicialização do servidor.

O nome do arquivo base da biblioteca de plugins é `ddl_rewriter`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o plug-in `ddl_rewriter`, use a instrução `INSTALL PLUGIN`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN ddl_rewriter SONAME 'ddl_rewriter.so';
```

Para verificar a instalação do plugin, examine a tabela de esquema de informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (ver Seção 7.6.2, Obtenção de Informações do Plugin do Servidor).

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS, PLUGIN_TYPE
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'ddl%';
+--------------+---------------+-------------+
| PLUGIN_NAME  | PLUGIN_STATUS | PLUGIN_TYPE |
+--------------+---------------+-------------+
| ddl_rewriter | ACTIVE        | AUDIT       |
+--------------+---------------+-------------+
```

Como o resultado anterior mostra, `ddl_rewriter` é implementado como um plugin de auditoria.

Se o plug-in falhar na inicialização, verifique o log de erros do servidor para mensagens de diagnóstico.

Uma vez instalado como descrito, o `ddl_rewriter` permanece instalado até ser desinstalado. Para removê-lo, use o `UNINSTALL PLUGIN`:

```
UNINSTALL PLUGIN ddl_rewriter;
```

Se o `ddl_rewriter` estiver instalado, você pode usar a `--ddl-rewriter` opção para as subsequentes inicializações do servidor para controlar a ativação do `ddl_rewriter` plugin. Por exemplo, para evitar que o plugin seja ativado no tempo de execução, use esta opção:

```
[mysqld]
ddl-rewriter=OFF
```
