#### 8.4.3.1 Instalação e Desinstalação do Componente de Validação de Senhas

Esta seção descreve como instalar e desinstalar o componente `validate_password` de validação de senhas. Para informações gerais sobre a instalação e desinstalação de componentes, consulte a Seção 7.5, “Componentes MySQL”.

::: info Nota

Se você instalar o MySQL 8.4 usando o repositório [MySQL Yum](https://dev.mysql.com/downloads/repo/yum/), o repositório [MySQL SLES](https://dev.mysql.com/downloads/repo/suse/) ou pacotes RPM fornecidos pela Oracle, o componente `validate_password` é ativado por padrão após você iniciar seu servidor MySQL pela primeira vez.

As atualizações para o MySQL 8.4 a partir do 8.3 usando pacotes Yum ou RPM deixam o plugin `validate_password` em vigor. Para fazer a transição do plugin `validate_password` para o componente `validate_password`, consulte a Seção 8.4.3.3, “Transição para o Componente de Validação de Senhas”.

Para ser utilizável pelo servidor, o arquivo da biblioteca do componente deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` na inicialização do servidor.

Para instalar o componente `validate_password`, use a seguinte declaração:

```
INSTALL COMPONENT 'file://component_validate_password';
```

A instalação do componente é uma operação única que não precisa ser feita a cada inicialização do servidor. `INSTALL COMPONENT` carrega o componente e também o registra na tabela do sistema `mysql.component` para que ele seja carregado durante as inicializações subsequentes do servidor.

Para desinstalar o componente `validate_password`, use a seguinte declaração:

```
UNINSTALL COMPONENT 'file://component_validate_password';
```

 `UNINSTALL COMPONENT` desliga o componente e o desregistra da tabela do sistema `mysql.component` para que ele não seja carregado durante as inicializações subsequentes do servidor.