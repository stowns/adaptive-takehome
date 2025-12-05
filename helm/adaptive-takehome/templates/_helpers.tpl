{{/*
Expand the name of the chart.
*/}}
{{- define "adaptive-takehome.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "adaptive-takehome.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "adaptive-takehome.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "adaptive-takehome.labels" -}}
helm.sh/chart: {{ include "adaptive-takehome.chart" . }}
{{ include "adaptive-takehome.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "adaptive-takehome.selectorLabels" -}}
app.kubernetes.io/name: {{ include "adaptive-takehome.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Ollama name
*/}}
{{- define "ollama.name" -}}
ollama
{{- end }}

{{- define "ollama.selectorLabels" -}}
app.kubernetes.io/name: {{ include "ollama.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}


