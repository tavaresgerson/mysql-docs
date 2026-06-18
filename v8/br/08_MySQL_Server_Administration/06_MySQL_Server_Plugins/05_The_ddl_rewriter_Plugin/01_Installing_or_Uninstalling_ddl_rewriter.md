#### 7.6.5.1 Instalar ou desinstalar o ddl\_rewriter

Esta seção descreve como instalar ou desinstalar o plugin `ddl_rewriter`. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Nota

Se instalado, o plugin `ddl_rewriter` envolve um pequeno custo adicional, mesmo quando desativado. Para evitar esse custo adicional, instale o `ddl_rewriter` apenas pelo período em que você pretende usá-lo.

O caso de uso principal é a modificação de declarações restauradas de arquivos de dump, portanto, o padrão de uso típico é: 1) Instale o plugin; 2) restaure o arquivo ou arquivos de dump; 3) desinstale o plugin.

Para que o plugin seja utilizado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin configurando o valor de `plugin_dir` durante o início do servidor.

O nome de base do arquivo da biblioteca de plugins é `ddl_rewriter`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o plugin `ddl_rewriter`, use a instrução `INSTALL PLUGIN`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN ddl_rewriter SONAME 'ddl_rewriter.so';
```

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

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

Como o resultado anterior mostra, o `ddl_rewriter` é implementado como um plugin de auditoria.

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

Uma vez instalado conforme descrito, `ddl_rewriter` permanece instalado até ser desinstalado. Para removê-lo, use `UNINSTALL PLUGIN`:

```
UNINSTALL PLUGIN ddl_rewriter;
```

Se o `ddl_rewriter` estiver instalado, você pode usar a opção `--ddl-rewriter` para o início subsequente do servidor para controlar a ativação do plugin `ddl_rewriter`. Por exemplo, para impedir que o plugin seja ativado em tempo de execução, use esta opção:

```
[mysqld]
ddl-rewriter=OFF
```
