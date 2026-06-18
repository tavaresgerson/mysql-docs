#### 8.4.3.1 Instalação e desinstalação do componente de validação de senha

Esta seção descreve como instalar e desinstalar o componente de validação de senha `validate_password`. Para informações gerais sobre como instalar e desinstalar componentes, consulte a Seção 7.5, “Componentes do MySQL”.

Nota

Se você instalar o MySQL 8.0 usando o repositório MySQL Yum, o repositório SLES ou os pacotes RPM fornecidos pela Oracle, o componente `validate_password` será ativado por padrão após você iniciar o seu servidor MySQL pela primeira vez.

As atualizações do MySQL 8.0 para a versão 5.7 usando pacotes Yum ou RPM deixam o plugin `validate_password` em vigor. Para fazer a transição do plugin `validate_password` para o componente `validate_password`, consulte a Seção 8.4.3.3, “Transição para o Componente de Validação de Senhas”.

Para que o componente seja utilizado pelo servidor, o arquivo da biblioteca de componentes deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin configurando o valor de `plugin_dir` durante o início do servidor.

Para instalar o componente `validate_password`, use esta declaração:

```
INSTALL COMPONENT 'file://component_validate_password';
```

A instalação do componente é uma operação única que não precisa ser feita a cada inicialização do servidor. `INSTALL COMPONENT` carrega o componente e também o registra na tabela do sistema `mysql.component` para que ele seja carregado durante as subsequentes inicializações do servidor.

Para desinstalar o componente `validate_password`, use esta declaração:

```
UNINSTALL COMPONENT 'file://component_validate_password';
```

`UNINSTALL COMPONENT` descarrega o componente e o desregistra da tabela de sistema `mysql.component`, para que ele não seja carregado durante as próximas inicializações do servidor.
