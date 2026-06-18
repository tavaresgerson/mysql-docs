### 7.5.1 Instalação e Desinstalação de Componentes

Os componentes devem ser carregados no servidor antes que possam ser usados. O MySQL suporta o carregamento manual de componentes em tempo de execução e o carregamento automático durante a inicialização do servidor.

Enquanto um componente estiver sendo carregado, as informações sobre ele estarão disponíveis conforme descrito na Seção 7.5.2, “Obtendo Informações sobre o Componente”.

As instruções SQL `INSTALL COMPONENT` e `UNINSTALL COMPONENT` permitem o carregamento e o descarregamento de componentes. Por exemplo:

```
INSTALL COMPONENT 'file://component_validate_password';
UNINSTALL COMPONENT 'file://component_validate_password';
```

Um serviço de carregamento lida com o carregamento e descarregamento dos componentes, além de registrar os componentes carregados na tabela do sistema `mysql.component`.

As instruções SQL para manipulação de componentes afetam o funcionamento do servidor e a tabela do sistema `mysql.component` da seguinte forma:

- `INSTALL COMPONENT` carrega componentes no servidor. Os componentes ficam ativos imediatamente. O serviço de carregamento também registra os componentes carregados na tabela do sistema `mysql.component`. Para reinicializações subsequentes do servidor, o serviço de carregamento carrega quaisquer componentes listados em `mysql.component` durante a sequência de inicialização. Isso ocorre mesmo se o servidor for iniciado com a opção `--skip-grant-tables`. A cláusula opcional `SET` permite definir valores de variáveis de sistema do componente ao instalar componentes.

- O `UNINSTALL COMPONENT` desativa os componentes e descarrega-os do servidor. O serviço de carregamento também desregistra os componentes da tabela do sistema `mysql.component`, para que o servidor não os carregue mais durante sua sequência de inicialização para reinicializações subsequentes.

Comparado à declaração correspondente `INSTALL PLUGIN` para plugins de servidor, a declaração `INSTALL COMPONENT` para componentes oferece a vantagem significativa de que não é necessário conhecer qualquer sufixo de nome de arquivo específico da plataforma para nomear o componente. Isso significa que uma determinada declaração `INSTALL COMPONENT` pode ser executada de forma uniforme em todas as plataformas.

Um componente, quando instalado, também pode instalar automaticamente funções carregáveis relacionadas. Se assim for, o componente, quando desinstalado, também desinstala automaticamente essas funções.
