### 7.5.1 Instalação e Desinstalação de Componentes

Os componentes devem ser carregados no servidor antes que possam ser utilizados. O MySQL suporta o carregamento manual de componentes em tempo de execução e o carregamento automático durante a inicialização do servidor.

Enquanto um componente está carregado, as informações sobre ele estão disponíveis conforme descrito na Seção 7.5.2, “Obtendo Informações do Componente”.

As instruções SQL `INSTALL COMPONENT` e `UNINSTALL COMPONENT` permitem o carregamento e o descarregamento de componentes. Por exemplo:

```
INSTALL COMPONENT 'file://component_validate_password';
UNINSTALL COMPONENT 'file://component_validate_password';
```

O serviço de carregador lida com o carregamento e o descarregamento de componentes, além de registrar os componentes carregados na tabela `mysql.component` do sistema.

As instruções SQL para manipulação de componentes afetam a operação do servidor e a tabela `mysql.component` do sistema da seguinte forma:

* `INSTALL COMPONENT` carrega componentes no servidor. Os componentes tornam-se ativos imediatamente. O serviço de carregador também registra os componentes carregados na tabela `mysql.component` do sistema. Para reinicializações subsequentes do servidor, o serviço de carregador carrega quaisquer componentes listados em `mysql.component` durante a sequência de inicialização. Isso ocorre mesmo se o servidor for iniciado com a opção `--skip-grant-tables`. A cláusula opcional `SET` permite definir valores de variáveis de sistema do componente ao instalar componentes.

* `UNINSTALL COMPONENT` desativa componentes e descarrega-os do servidor. O serviço de carregador também desregistra os componentes da tabela `mysql.component` do sistema para que o servidor não os carregue mais durante sua sequência de inicialização para reinicializações subsequentes.

Comparado à declaração `INSTALL PLUGIN` correspondente para plugins de servidor, a declaração `INSTALL COMPONENT` para componentes oferece a vantagem significativa de que não é necessário conhecer qualquer sufixo de nome de arquivo específico da plataforma para nomear o componente. Isso significa que uma determinada declaração `INSTALL COMPONENT` pode ser executada de forma uniforme em todas as plataformas.

Quando um componente é instalado, ele também pode instalar automaticamente funções carregáveis relacionadas. Se isso ocorrer, o componente, quando desinstalado, desinstala automaticamente essas funções.