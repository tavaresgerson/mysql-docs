#### 15.7.4.4. Declaração de INSTALAÇÃO DE PLUGIN

```
INSTALL PLUGIN plugin_name SONAME 'shared_library_name'
```

Esta declaração instala um plugin do servidor. Ela requer o privilégio `INSERT` para a tabela do sistema `mysql.plugin`, porque ela adiciona uma linha a essa tabela para registrar o plugin.

`plugin_name` é o nome do plugin conforme definido na estrutura do descritor do plugin contida no arquivo da biblioteca (veja Estruturas de Dados do Plugin). Os nomes dos plugins não são sensíveis a maiúsculas e minúsculas. Para a compatibilidade máxima, os nomes dos plugins devem ser limitados a letras ASCII, dígitos e sublinhados, pois são usados em arquivos de código-fonte C, linhas de comandos de shell, scripts de shell Bourne e ambientes SQL.

`shared_library_name` é o nome da biblioteca compartilhada que contém o código do plugin. O nome inclui a extensão do nome do arquivo (por exemplo, `libmyplugin.so`, `libmyplugin.dll` ou `libmyplugin.dylib`).

A biblioteca compartilhada deve estar localizada no diretório do plugin (o diretório nomeado pela variável de sistema `plugin_dir`). A biblioteca deve estar no próprio diretório do plugin, e não em um subdiretório. Por padrão, `plugin_dir` é o diretório `plugin` sob o diretório nomeado pela variável de configuração `pkglibdir`, mas isso pode ser alterado definindo o valor de `plugin_dir` durante o início do servidor. Por exemplo, defina seu valor em um arquivo `my.cnf`:

```
[mysqld]
plugin_dir=/path/to/plugin/directory
```

Se o valor de `plugin_dir` for um nome de caminho relativo, ele será considerado em relação ao diretório base do MySQL (o valor da variável de sistema `basedir`).

`INSTALL PLUGIN` carrega e inicializa o código do plugin para torná-lo disponível para uso. Um plugin é inicializado executando sua função de inicialização, que cuida de qualquer configuração que o plugin deve realizar antes de poder ser usado. Quando o servidor é desligado, ele executa a função de desinicialização para cada plugin que está carregado, para que o plugin tenha a chance de realizar qualquer limpeza final.

`INSTALL PLUGIN` também registra o plugin adicionando uma linha que indica o nome do plugin e o nome do arquivo da biblioteca à tabela do sistema `mysql.plugin`. Durante a sequência de inicialização normal, o servidor carrega e inicializa os plugins registrados em `mysql.plugin`. Isso significa que um plugin é instalado com `INSTALL PLUGIN` apenas uma vez, e não toda vez que o servidor é iniciado. Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugin` não são carregados e estão indisponíveis.

Uma biblioteca de plugins pode conter vários plugins. Para que cada um deles seja instalado, use uma declaração `INSTALL PLUGIN` separada. Cada declaração nomeia um plugin diferente, mas todos eles especificam o mesmo nome da biblioteca.

`INSTALL PLUGIN` faz com que o servidor leia os arquivos de opção (`my.cnf`) da mesma forma que durante o início do servidor. Isso permite que o plugin identifique quaisquer opções relevantes desses arquivos. É possível adicionar opções do plugin a um arquivo de opção mesmo antes de carregar um plugin (se o prefixo `loose` for usado). Também é possível desinstalar um plugin, editar `my.cnf` e instalar o plugin novamente. Reiniciar o plugin dessa maneira permite que ele receba os novos valores de opção sem a necessidade de reiniciar o servidor.

Para opções que controlam o carregamento individual de plugins na inicialização do servidor, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”. Se você precisar carregar plugins para uma única inicialização do servidor quando a opção `--skip-grant-tables` for fornecida (o que indica ao servidor que não deve ler tabelas do sistema), use a opção `--plugin-load`. Consulte a Seção 7.1.7, “Opções de Comando do Servidor”.

Para remover um plugin, use a instrução `UNINSTALL PLUGIN`.

Para obter informações adicionais sobre o carregamento de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ver quais plugins estão instalados, use a instrução `SHOW PLUGINS` ou consulte a tabela `INFORMATION_SCHEMA` ou `PLUGINS`.

Se você recompilar uma biblioteca de plugins e precisar instalá-la novamente, você pode usar qualquer um dos seguintes métodos:

- Use `UNINSTALL PLUGIN` para desinstalar todos os plugins na biblioteca, instale o novo arquivo de biblioteca de plugins no diretório de plugins e, em seguida, use `INSTALL PLUGIN` para instalar todos os plugins na biblioteca. Esse procedimento tem a vantagem de poder ser usado sem interromper o servidor. No entanto, se a biblioteca de plugins contiver muitos plugins, você deve emitir muitas declarações `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

- Pare o servidor, instale o novo arquivo da biblioteca de plugins no diretório de plugins e reinicie o servidor.
